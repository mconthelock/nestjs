import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import * as disk from 'fs/promises';
import { PilineEventInputController } from './PILINE_EVENT_INPUT.controller';
import { PilineEventInputService } from './PILINE_EVENT_INPUT.service';
import { PilineEventFilesService } from './PILINE_EVENT_FILES.service';

jest.mock('fs/promises', () => ({
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    rm: jest.fn(),
}));

const payload = {
    EVENT_DATE: '2026-10-09',
    SHIFT: 'Night',
    START_TIME: '23:30',
    END_TIME: '00:30',
    LOCATION_ID: 1,
    SSECCODE: 'IPE',
    CAUSE_ID: 1,
    PROBLEM_ID: 1,
    INITIAL_ID: 1,
    DETAIL: 'Machine stopped',
    IS_NG: '0',
    CREATE_BY: '123456',
};
const ng = {
    ID_TAG: 'TAG1',
    QTY: 2,
    MAT_LOT: 'LOT1',
    MAT_NO: 'MAT1',
    REMARK_NG: 'Damage',
};
const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);

describe('Production event input API', () => {
    let app: INestApplication;
    const insertEvent = jest.fn(),
        insertNg = jest.fn(),
        insertAtt = jest.fn(),
        findMonthly = jest.fn();
    const existsBy = jest.fn(),
        mapping = jest.fn(),
        maxRun = jest.fn();
    const qb = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: maxRun,
    };
    const runner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        query: jest.fn(),
        isTransactionActive: true,
        manager: {
            getRepository: (entity: { name: string }) => {
                switch (entity.name) {
                    case 'PILINE_EVENT_RECORD':
                        return {
                            find: findMonthly,
                            createQueryBuilder: () => qb,
                            insert: insertEvent,
                        };
                    case 'PILINE_NG_RECORD':
                        return { insert: insertNg };
                    case 'PILINE_ATT':
                        return { insert: insertAtt };
                    case 'PILINE_MAPPING_MST':
                        return { findOneBy: mapping };
                    default:
                        return { existsBy };
                }
            },
        },
    };
    const ds = { options: { type: 'oracle' }, createQueryRunner: () => runner };
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            controllers: [PilineEventInputController],
            providers: [
                PilineEventInputService,
                PilineEventFilesService,
                {
                    provide: getDataSourceToken('workloadConnection'),
                    useValue: ds,
                },
            ],
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({ transform: true, whitelist: true }),
        );
        await app.init();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        for (const mock of [
            insertEvent,
            insertNg,
            insertAtt,
            runner.connect,
            runner.startTransaction,
            runner.commitTransaction,
            runner.rollbackTransaction,
            runner.release,
            runner.query,
            disk.mkdir,
            disk.writeFile,
            disk.rm,
        ])
            (mock as jest.Mock).mockReset().mockResolvedValue(undefined);
        ds.options.type = 'oracle';
        runner.isTransactionActive = true;
        findMonthly.mockReset().mockResolvedValue([]);
        existsBy.mockReset().mockResolvedValue(true);
        mapping.mockReset().mockResolvedValue({ EVENT_ID: 1 });
        maxRun.mockReset().mockResolvedValue({ MAX_RUN: 0 });
    });
    afterAll(async () => {
        await app.close();
    });
    const post = (data: object) =>
        request(app.getHttpServer())
            .post('/workload/piline_event_record/input')
            .field('payload', JSON.stringify(data));

    it('saves non-NG, generates the first monthly number and handles overnight times', async () => {
        const res = await post(payload).expect(201);
        expect(res.body.data.PILINE_NO).toBe('PI2610001');
        expect(res.body.data.RUN_NO).toBe(1);
        const record = insertEvent.mock.calls[0][0];
        expect(record.END_TIME.getTime() - record.START_TIME.getTime()).toBe(
            3600000,
        );
        expect(record.EVENT_DATE.toISOString()).toBe(
            '2026-10-08T17:00:00.000Z',
        );
        expect(insertNg).not.toHaveBeenCalled();
        expect(runner.query).toHaveBeenCalledWith(
            expect.stringContaining('EXCLUSIVE MODE NOWAIT'),
        );
        expect(runner.commitTransaction).toHaveBeenCalledTimes(1);
        expect(runner.release).toHaveBeenCalledTimes(1);
    });
    it('increments monthly document number separately from daily RUN_NO', async () => {
        findMonthly.mockResolvedValue([
            { PILINE_NO: 'PI2610008' },
            { PILINE_NO: 'PI2610002' },
        ]);
        maxRun.mockResolvedValue({ MAX_RUN: 3 });
        const res = await post(payload).expect(201);
        expect(res.body.data).toMatchObject({
            PILINE_NO: 'PI2610009',
            RUN_NO: 4,
        });
    });
    it('saves event, NG and both attachment groups with one key and commits last', async () => {
        const res = await post({ ...payload, IS_NG: '1', NG: ng })
            .attach('eventFiles', png, 'event.png')
            .attach('ngFiles', png, 'ng.png')
            .expect(201);
        expect(insertNg).toHaveBeenCalledWith({
            ...ng,
            PILINE_NO: res.body.data.PILINE_NO,
        });
        expect(insertAtt.mock.calls[0][0]).toEqual([
            expect.objectContaining({
                PILINE_NO: 'PI2610001',
                TYPEFILE: 'EVT',
                SEQ: 1,
            }),
            expect.objectContaining({
                PILINE_NO: 'PI2610001',
                TYPEFILE: 'NG',
                SEQ: 2,
            }),
        ]);
        expect(insertAtt.mock.invocationCallOrder[0]).toBeLessThan(
            runner.commitTransaction.mock.invocationCallOrder[0],
        );
        expect(disk.rm).not.toHaveBeenCalled();
    });
    it.each([
        { IS_NG: '1' },
        { IS_NG: '0', NG: ng },
        { IS_NG: '1', NG: { ...ng, QTY: 0 } },
        { IS_NG: '1', NG: { ...ng, MAT_LOT: '' } },
        { IS_NG: '1', NG: { ...ng, MAT_NO: '' } },
        { EVENT_DATE: '2026-02-30' },
        { START_TIME: '25:00' },
        { SSECCODE: '' },
        { DETAIL: '' },
        { PILINE_NO: 'client-generated' },
        { RUN_NO: 999 },
        { CREATE_BY: '' },
    ])('rejects invalid payload %j before inserting', async (invalid) => {
        await post({ ...payload, ...invalid }).expect(400);
        expect(insertEvent).not.toHaveBeenCalled();
    });
    it('rejects NG attachments without NG selected', async () => {
        await post(payload).attach('ngFiles', png, 'ng.png').expect(400);
        expect(disk.writeFile).not.toHaveBeenCalled();
    });
    it('rejects spoofed images before touching disk or database', async () => {
        await post(payload)
            .attach(
                'eventFiles',
                Buffer.from('<script>bad</script>'),
                'fake.png',
            )
            .expect(400);
        expect(disk.writeFile).not.toHaveBeenCalled();
        expect(insertEvent).not.toHaveBeenCalled();
    });
    it('rejects files larger than 5 MB', async () => {
        await post(payload)
            .attach(
                'eventFiles',
                Buffer.alloc(5 * 1024 * 1024 + 1),
                'large.png',
            )
            .expect(413);
        expect(insertEvent).not.toHaveBeenCalled();
    });
    it('rolls back and cleans staged files when NG insertion fails', async () => {
        insertNg.mockRejectedValue({ driverError: { errorNum: 2291 } });
        await post({ ...payload, IS_NG: '1', NG: ng })
            .attach('eventFiles', png, 'event.png')
            .expect(409);
        expect(runner.rollbackTransaction).toHaveBeenCalledTimes(1);
        expect(runner.commitTransaction).not.toHaveBeenCalled();
        expect(disk.rm).toHaveBeenCalledTimes(1);
    });
    it('cleans staged files if connection fails before the transaction starts', async () => {
        runner.connect.mockRejectedValue(new Error('unavailable'));
        runner.isTransactionActive = false;
        await post(payload).attach('eventFiles', png, 'event.png').expect(500);
        expect(disk.rm).toHaveBeenCalledTimes(1);
        expect(runner.release).toHaveBeenCalled();
    });
    it('rejects inactive master data and rolls back', async () => {
        existsBy.mockResolvedValue(false);
        await post(payload).expect(400);
        expect(insertEvent).not.toHaveBeenCalled();
        expect(runner.rollbackTransaction).toHaveBeenCalled();
    });
    it('rejects missing mapping', async () => {
        mapping.mockResolvedValue(null);
        await post(payload).expect(400);
        expect(insertEvent).not.toHaveBeenCalled();
    });
    it('stops at the three-digit monthly limit', async () => {
        findMonthly.mockResolvedValue([{ PILINE_NO: 'PI2610999' }]);
        await post(payload).expect(409);
        expect(insertEvent).not.toHaveBeenCalled();
    });
    it('returns a conflict if another transaction keeps the number lock', async () => {
        runner.query.mockRejectedValue({ errorNum: 54 });
        await post(payload).expect(409);
        expect(insertEvent).not.toHaveBeenCalled();
    });
    it('preserves files when the COMMIT outcome is unknown', async () => {
        runner.commitTransaction.mockRejectedValue(
            new Error('connection lost during commit'),
        );
        await post(payload).attach('eventFiles', png, 'event.png').expect(503);
        expect(disk.rm).not.toHaveBeenCalled();
    });
    it('holds the MySQL advisory lock until after commit', async () => {
        ds.options.type = 'mysql';
        runner.query.mockResolvedValue([{ ACQUIRED: 1 }]);
        await post(payload).expect(201);
        expect(runner.query.mock.calls[1][0]).toContain('RELEASE_LOCK');
        expect(runner.query.mock.invocationCallOrder[1]).toBeGreaterThan(
            runner.commitTransaction.mock.invocationCallOrder[0],
        );
    });
});
