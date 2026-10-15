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
    readFile: jest.fn(),
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
    const findAtt = jest.fn();
    const deleteAtt = jest.fn();
    const findExisting = jest.fn(), updateEvent = jest.fn(), deleteNg = jest.fn(), findFiles = jest.fn();
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
                            find: findMonthly, findOneBy: findExisting, update: updateEvent,
                            createQueryBuilder: () => qb,
                            insert: insertEvent,
                        };
                    case 'PILINE_NG_RECORD':
                        return { insert: insertNg, delete: deleteNg };
                    case 'PILINE_ATT':
                        return { insert: insertAtt, findBy: findFiles, delete: deleteAtt, findOneBy: findAtt };
                    case 'PILINE_MAPPING_MST':
                        return { findOneBy: mapping };
                    default:
                        return { existsBy };
                }
            },
        },
    };
    const ds = { options: { type: 'oracle' }, createQueryRunner: () => runner, getRepository: runner.manager.getRepository };
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
        findAtt.mockReset().mockResolvedValue({FILENAME:'PI2610001/existing.png'});
        (disk.readFile as jest.Mock).mockReset().mockResolvedValue(png);
        deleteAtt.mockReset().mockResolvedValue({affected:1});
        findExisting.mockReset().mockResolvedValue({PILINE_NO:'PI2610001',EVENT_DATE:new Date('2026-10-09T00:00:00+07:00'),RUN_NO:1,IS_NG:'0',RECORD_STATUS:'ACTIVE',CREATE_BY:'11111'});
        updateEvent.mockReset().mockResolvedValue({affected:1}); deleteNg.mockReset().mockResolvedValue({affected:1}); findFiles.mockReset().mockResolvedValue([]);
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

    it('saves non-NG, generates the first daily number and handles overnight times', async () => {
        const res = await post(payload).expect(201);
        expect(res.body.data.PILINE_NO).toBe('PI261009001');
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
    it('uses the daily RUN_NO as the document suffix', async () => {
        findMonthly.mockResolvedValue([
            { PILINE_NO: 'PI2610008' },
            { PILINE_NO: 'PI2610002' },
        ]);
        maxRun.mockResolvedValue({ MAX_RUN: 3 });
        const res = await post(payload).expect(201);
        expect(res.body.data).toMatchObject({
            PILINE_NO: 'PI261009004',
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
                PILINE_NO: 'PI261009001',
                TYPEFILE: 'EVT',
                SEQ: 1,
            }),
            expect.objectContaining({
                PILINE_NO: 'PI261009001',
                TYPEFILE: 'NG',
                SEQ: 1,
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
    it('does not write files if connection fails before the transaction starts', async () => {
        runner.connect.mockRejectedValue(new Error('unavailable'));
        runner.isTransactionActive = false;
        await post(payload).attach('eventFiles', png, 'event.png').expect(500);
        expect(disk.rm).not.toHaveBeenCalled();
        expect(disk.writeFile).not.toHaveBeenCalled();
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
    it('stops at the three-digit daily limit', async () => {
        maxRun.mockResolvedValue({ MAX_RUN: 999 });
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
    it('accepts blank optional Material Lot', async () => { await post({ ...payload, IS_NG: '1', NG: { ...ng, MAT_LOT: '' } }).expect(201); });
    it('creates ACTIVE numbers from selected event date', async () => {
        const res = await post({...payload,EVENT_DATE:'2025-02-10'}).expect(201);
        expect(res.body.data).toMatchObject({PILINE_NO:'PI250210001',RECORD_STATUS:'ACTIVE'});
    });
    const patch = (value: object) => request(app.getHttpServer()).patch('/workload/piline_event_record/input/PI2610001').field('payload',JSON.stringify(value));
    it('updates in one transaction and preserves generated fields',async()=>{
        await patch({...payload,DETAIL:'Edited'}).expect(200);
        expect(insertEvent).not.toHaveBeenCalled(); expect(findMonthly).not.toHaveBeenCalled();
        const changes = updateEvent.mock.calls[0][1];
        expect(changes).toMatchObject({DETAIL:'Edited',UPDATE_BY:payload.CREATE_BY});
        for(const key of ['EVENT_DATE','RUN_NO','PILINE_NO','CREATE_BY','CREATE_DATE','RECORD_STATUS']) expect(changes).not.toHaveProperty(key);
        expect(runner.commitTransaction).toHaveBeenCalledTimes(1);
    });
    it('rejects date changes',async()=>{await patch({...payload,EVENT_DATE:'2026-10-10'}).expect(400);expect(updateEvent).not.toHaveBeenCalled();});
    it('rejects QC_REJECT NG even if request changes IS_NG',async()=>{
        findExisting.mockResolvedValue({EVENT_DATE:new Date('2026-10-09'),IS_NG:'1',RECORD_STATUS:'QC_REJECT'});
        await patch(payload).expect(409);expect(updateEvent).not.toHaveBeenCalled();
    });
    it('rejects DELETE events',async()=>{findExisting.mockResolvedValue({RECORD_STATUS:'DELETE'});await patch(payload).expect(404);});
    it('appends attachments after existing sequences',async()=>{
        findFiles.mockResolvedValue([{SEQ:3,TYPEFILE:'EVT'}]);
        await patch(payload).attach('eventFiles',png,'added.png').expect(200);
        expect(insertAtt.mock.calls[0][0][0]).toMatchObject({SEQ:4,PILINE_NO:'PI2610001'});
    });

    it('stores uploads directly in the PI number folder and rolls back only new files', async () => {
        const previous = process.env.PILINE_FILE_PATH;
        process.env.PILINE_FILE_PATH = 'C:/piline-test-root';
        try {
            findFiles.mockResolvedValue([{SEQ:3,TYPEFILE:'EVT',FILENAME:'PI2610001/existing.png'}]);
            insertAtt.mockRejectedValueOnce(new Error('attachment insert failed'));
            await patch(payload).attach('eventFiles',png,'new.png').expect(500);
            const path = String((disk.writeFile as jest.Mock).mock.calls[0][0]).replace(/\\/g,'/');
            expect(path).toMatch(/^C:\/piline-test-root\/PI2610001\/4-new-.*\.png$/);
            expect(disk.rm).toHaveBeenCalledWith((disk.writeFile as jest.Mock).mock.calls[0][0],{force:true});
            expect(disk.rm).toHaveBeenCalledTimes(1);
        } finally { if(previous === undefined) delete process.env.PILINE_FILE_PATH; else process.env.PILINE_FILE_PATH = previous; }
    });

    it('numbers EVT and NG separately on creation', async () => {
        await post({ ...payload, IS_NG: '1', NG: ng })
            .attach('eventFiles', png, 'a.png').attach('eventFiles', png, 'b.png').attach('eventFiles', png, 'c.png')
            .attach('ngFiles', png, 'd.png').attach('ngFiles', png, 'e.png').expect(201);
        expect(insertAtt.mock.calls[0][0].map(({TYPEFILE,SEQ}) => [TYPEFILE,SEQ]))
            .toEqual([['EVT',1],['EVT',2],['EVT',3],['NG',1],['NG',2]]);
    });
    it('continues each type from its own highest sequence when editing', async () => {
        findFiles.mockResolvedValue([{TYPEFILE:'EVT',SEQ:3},{TYPEFILE:'NG',SEQ:2}]);
        await patch({ ...payload, IS_NG: '1', NG: ng })
            .attach('eventFiles',png,'a.png').attach('ngFiles',png,'b.png').expect(200);
        expect(insertAtt.mock.calls[0][0].map(({TYPEFILE,SEQ}) => [TYPEFILE,SEQ]))
            .toEqual([['EVT',4],['NG',3]]);
    });
    it('starts a newly added type at one despite existing other-type files', async () => {
        findFiles.mockResolvedValue([{TYPEFILE:'EVT',SEQ:3}]);
        await patch({ ...payload, IS_NG: '1', NG: ng }).attach('ngFiles',png,'a.png').expect(200);
        expect(insertAtt.mock.calls[0][0][0]).toMatchObject({TYPEFILE:'NG',SEQ:1});
    });
    it('includes the selected day and restarts numbering for a new date', async () => {
        maxRun.mockResolvedValueOnce({MAX_RUN:2}).mockResolvedValueOnce({MAX_RUN:0});
        const first = await post({...payload,EVENT_DATE:'2026-10-12'}).expect(201);
        const second = await post({...payload,EVENT_DATE:'2026-10-13'}).expect(201);
        expect(first.body.data.PILINE_NO).toBe('PI261012003');
        expect(second.body.data.PILINE_NO).toBe('PI261013001');
        expect(qb.where).toHaveBeenCalledWith('record.EVENT_DATE = :date',{date:new Date('2026-10-13T00:00:00+07:00')});
    });



    it('deletes only selected existing file after commit, including matching SEQ in different types', async () => {
        findFiles.mockResolvedValue([{TYPEFILE:'EVT',SEQ:1,FILENAME:'PI2610001/event.png'},{TYPEFILE:'NG',SEQ:1,FILENAME:'PI2610001/ng.png'}]);
        await patch({...payload,DELETE_FILES:[{TYPEFILE:'NG',SEQ:1}]}).expect(200);
        expect(deleteAtt).toHaveBeenCalledWith({PILINE_NO:'PI2610001',TYPEFILE:'NG',SEQ:1});
        expect(deleteAtt).toHaveBeenCalledTimes(1);
        expect(disk.rm).toHaveBeenCalledTimes(1);
        expect(String((disk.rm as jest.Mock).mock.calls[0][0])).toMatch(/ng\.png$/);
        expect((disk.rm as jest.Mock).mock.invocationCallOrder[0]).toBeGreaterThan(runner.commitTransaction.mock.invocationCallOrder[0]);
    });
    it('rejects deletion of an attachment not on this record',async()=>{
        await patch({...payload,DELETE_FILES:[{TYPEFILE:'EVT',SEQ:9}]}).expect(409);
        expect(deleteAtt).not.toHaveBeenCalled();expect(disk.rm).not.toHaveBeenCalled();expect(runner.rollbackTransaction).toHaveBeenCalled();
    });
    it('keeps old physical files if transaction fails',async()=>{
        findFiles.mockResolvedValue([{TYPEFILE:'EVT',SEQ:1,FILENAME:'PI2610001/old.png'}]);
        deleteAtt.mockRejectedValueOnce(new Error('delete failed'));
        await patch({...payload,DELETE_FILES:[{TYPEFILE:'EVT',SEQ:1}]}).expect(500);
        expect(disk.rm).not.toHaveBeenCalled();expect(runner.rollbackTransaction).toHaveBeenCalled();
    });
    it('does not accept file deletion on creation',async()=>{
        await post({...payload,DELETE_FILES:[{TYPEFILE:'EVT',SEQ:1}]}).expect(400);
        expect(disk.rm).not.toHaveBeenCalled();
    });

    it('serves an existing attachment through the record key',async()=>{
        const res = await request(app.getHttpServer()).get('/workload/piline_event_record/input/PI2610001/files/EVT/1').expect(200);
        expect(res.headers['content-type']).toMatch(/image\/png/);
        expect(res.body).toEqual(png);
        expect(findAtt).toHaveBeenCalledWith({PILINE_NO:'PI2610001',TYPEFILE:'EVT',SEQ:1});
    });
    it('returns 404 for a file not linked to the record',async()=>{
        findAtt.mockResolvedValue(null);
        await request(app.getHttpServer()).get('/workload/piline_event_record/input/PI2610001/files/EVT/1').expect(404);
        expect(disk.readFile).not.toHaveBeenCalled();
    });
    it('refuses a stored path outside upload root',async()=>{
        findAtt.mockResolvedValue({FILENAME:'../outside.png'});
        await request(app.getHttpServer()).get('/workload/piline_event_record/input/PI2610001/files/EVT/1').expect(400);
        expect(disk.readFile).not.toHaveBeenCalled();
    });
});
