import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { IeTsController } from './ie-ts.controller';
import { IeTsService } from './ie-ts.service';

const key = {
    NFRMNO: 31,
    VORGNO: '051401',
    CYEAR: '26',
    CYEAR2: '2026',
    NRUNNO: 42,
};
const base = '/ieform/ie-ts';

describe('IE-TS HTTP contract', () => {
    let app: any;
    let service: any;
    beforeAll(async () => {
        service = Object.fromEntries(
            ['insert', 'autoInsert', 'find', 'update', 'remove'].map(
                (method) => [
                    method,
                    jest.fn().mockResolvedValue({ status: true, key }),
                ],
            ),
        );
        const module = await Test.createTestingModule({
            controllers: [IeTsController],
            providers: [{ provide: IeTsService, useValue: service }],
        }).compile();
        app = module.createNestApplication();
        // Match the production global transform/whitelist before controller pipes.
        app.useGlobalPipes(
            new ValidationPipe({ transform: true, whitelist: true }),
        );
        await app.init();
    });
    afterAll(async () => {
        await app?.close();
    });
    beforeEach(() => jest.clearAllMocks());

    it('accepts the provided six-process sample with blank LNO', async () => {
        const sample = JSON.parse(
            readFileSync(join(__dirname, 'auto-insert-ts.sample.json'), 'utf8'),
        );
        await request(app.getHttpServer())
            .post(base + '/auto_insert_ts_process')
            .send(sample)
            .expect(201);
        const received = service.autoInsert.mock.calls[0][0];
        expect(received.map((form) => form.ITEMS.length)).toEqual([4, 2]);
        expect(
            received
                .flatMap((form) => form.ITEMS)
                .every((row) => row.LNO === null),
        ).toBe(true);
    });

    it('serves POST insert and PUT replacement at the documented URLs', async () => {
        const dto = { ...key, HEADERS: [{ SEQ: '001' }] };
        await request(app.getHttpServer())
            .post(base + '/insert_ts_process')
            .send(dto)
            .expect(201);
        await request(app.getHttpServer())
            .put(base + '/update_ts_process')
            .send(dto)
            .expect(200);
        expect(service.insert).toHaveBeenCalledWith(
            expect.objectContaining(dto),
        );
        expect(service.update).toHaveBeenCalledWith(
            expect.objectContaining(dto),
        );
    });
    it('parses and validates the full key for GET and DELETE queries', async () => {
        await request(app.getHttpServer())
            .get(base + '/get_ts_process')
            .query(key)
            .expect(200);
        await request(app.getHttpServer())
            .delete(base + '/delete_ts_process')
            .query(key)
            .expect(200);
        expect(service.find).toHaveBeenCalledWith(expect.objectContaining(key));
        expect(service.remove).toHaveBeenCalledWith(
            expect.objectContaining(key),
        );
        const { NRUNNO, ...missing } = key;
        await request(app.getHttpServer())
            .delete(base + '/delete_ts_process')
            .query(missing)
            .expect(400);
        expect(service.remove).toHaveBeenCalledTimes(1);
    });
    it('accepts auto payload without generated keys and rejects supplied reference values', async () => {
        const { CYEAR2, NRUNNO, ...master } = key;
        const dto = {
            ...master,
            REQUEST_BY: '12345',
            INPUT_BY: '23456',
            ITEMS: [
                {
                    DWG: 'DWG000001',
                    GNO: '001',
                    LNO: '001',
                    ITEM: '001',
                    PROCID: 'P1',
                    PROCID_OLD: 'P0',
                },
            ],
        };
        await request(app.getHttpServer())
            .post(base + '/auto_insert_ts_process')
            .send([dto])
            .expect(201);
        expect(service.autoInsert).toHaveBeenCalledWith(
            [expect.objectContaining(dto)],
            expect.any(String),
        );
        await request(app.getHttpServer())
            .post(base + '/auto_insert_ts_process')
            .send([{ ...dto, CYEAR2, NRUNNO }])
            .expect(400);
        expect(service.autoInsert).toHaveBeenCalledTimes(1);
        for (const invalid of [
            dto,
            [null],
            [{ ...dto, ITEMS: [] }],
            [{ ...dto, ITEMS: [{ ...dto.ITEMS[0], PROCID_OLD: '' }] }],
        ]) {
            await request(app.getHttpServer())
                .post(base + '/auto_insert_ts_process')
                .send(invalid)
                .expect(400);
        }
        expect(service.autoInsert).toHaveBeenCalledTimes(1);
    });
    it('rejects malformed nested payloads before reaching the service', async () => {
        await request(app.getHttpServer())
            .post(base + '/insert_ts_process')
            .send({
                ...key,
                HEADERS: [{ SEQ: '001', INPUTDATE: '2026-02-31' }],
            })
            .expect(400);
        await request(app.getHttpServer())
            .post(base + '/insert_ts_process')
            .send({ ...key, HEADERS: [null] })
            .expect(400);
        expect(service.insert).not.toHaveBeenCalled();
    });
});
