import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource, QueryFailedError } from 'typeorm';
import request from 'supertest';
import { PilineCrudRepository } from './PILINE-CRUD.repository';

const cases = [
    ['cause_mst', { CAUSE_ID: 1 }, { CAUSE_NAME: 'Cause' }],
    [
        'event_mst',
        { EVENT_ID: 1 },
        {
            MAIN_CATEGORY: 'Main',
            EVENT_TYPE: 'Type',
            PRODUCTION_IMPACT: 'Stop',
        },
    ],
    ['initial_mst', { INITIAL_ID: 1 }, { INITIAL_DETAIL: 'Initial' }],
    ['location_mst', { LOCATION_ID: 1 }, { LOCATION_NAME: 'Location' }],
    ['problem_mst', { PROBLEM_ID: 1 }, { PROBLEM_NAME: 'Problem' }],
    [
        'mapping_mst',
        { MAP_ID: 1 },
        { LOCATION_ID: 1, CAUSE_ID: 1, PROBLEM_ID: 1, EVENT_ID: 1 },
    ],
    ['section_mst', { SSECCODE: '123456' }, {}],
    [
        'event_record',
        { PILINE_NO: 'PI000000001' },
        {
            EVENT_DATE: '2026-10-09T00:00:00+07:00',
            RUN_NO: 1,
            SHIFT: 'DAY',
            START_TIME: '2026-10-09T08:00:00+07:00',
            END_TIME: '2026-10-09T09:00:00+07:00',
            LOCATION_ID: 1,
            CAUSE_ID: 1,
            PROBLEM_ID: 1,
            INITIAL_ID: 1,
            CREATE_BY: '123456',
        },
    ],
    ['ng_record', { PILINE_NO: 'PI000000001' }, { ID_TAG: 'TAG1', QTY: 1 }],
    [
        'att',
        { PILINE_NO: 'PI000000001', SEQ: 1, TYPEFILE: 'jpg' },
        { FILENAME: 'image.jpg' },
    ],
] as const;

describe.each(cases)('PILINE %s HTTP writes', (suffix, key, fields) => {
    let app: INestApplication;
    let db: {
        metadata: object;
        insert: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
    const slug = `piline_${suffix}`;
    const className = slug
        .split('_')
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join('');
    const path = `/workload/${slug}`;
    const recordPath = path + '/' + Object.values(key).join('/');

    beforeAll(async () => {
        const controller = require(`../${slug}/${slug.toUpperCase()}.controller`)[
            className + 'Controller'
        ];
        const service = require(`../${slug}/${slug.toUpperCase()}.service`)[
            className + 'Service'
        ];
        const repository = require(`../${slug}/${slug.toUpperCase()}.repository`)[
            className + 'Repository'
        ];
        db = {
            metadata: {
                primaryColumns: Object.keys(key).map((propertyName) => ({
                    propertyName,
                })),
            },
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const ds = {
            manager: { getRepository: () => db },
        } as unknown as DataSource;
        const module = await Test.createTestingModule({
            controllers: [controller],
            providers: [
                service,
                { provide: repository, useValue: new repository(ds) },
            ],
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({ transform: true, whitelist: true }),
        );
        await app.init();
    });
    beforeEach(() => {
        db.insert.mockReset().mockResolvedValue({});
        db.update.mockReset().mockResolvedValue({ affected: 1 });
        db.delete.mockReset().mockResolvedValue({ affected: 1 });
    });
    afterAll(async () => {
        await app.close();
    });

    it('inserts a valid payload and returns its key', async () => {
        const res = await request(app.getHttpServer())
            .post(path)
            .send({ ...key, ...fields, UNKNOWN: 'ignored' })
            .expect(201);
        expect(res.body.data).toEqual(key);
        expect(db.insert).toHaveBeenCalledTimes(1);
        expect(db.insert.mock.calls[0][0]).not.toHaveProperty('UNKNOWN');
        if (suffix === 'event_record')
            expect(db.insert.mock.calls[0][0].EVENT_DATE).toBeInstanceOf(Date);
    });
    it('rejects missing required create fields', async () => {
        await request(app.getHttpServer()).post(path).send({}).expect(400);
        expect(db.insert).not.toHaveBeenCalled();
    });
    it('updates only mutable fields, using all route key components', async () => {
        if (suffix === 'section_mst') {
            await request(app.getHttpServer())
                .patch(recordPath)
                .send({})
                .expect(400);
            expect(db.update).not.toHaveBeenCalled();
            return;
        }
        await request(app.getHttpServer())
            .patch(recordPath)
            .send(fields)
            .expect(200);
        expect(db.update.mock.calls[0][0]).toEqual(key);
    });
    it('rejects empty patches', async () => {
        await request(app.getHttpServer())
            .patch(recordPath)
            .send({})
            .expect(400);
        expect(db.update).not.toHaveBeenCalled();
    });
    it('deletes using the exact key and returns 404 if missing', async () => {
        await request(app.getHttpServer()).delete(recordPath).expect(200);
        expect(db.delete).toHaveBeenCalledWith(key);
        db.delete.mockResolvedValue({ affected: 0 });
        await request(app.getHttpServer()).delete(recordPath).expect(404);
    });
    it('returns 409 for duplicate keys and FK violations', async () => {
        db.insert.mockRejectedValue(
            new QueryFailedError(
                'insert',
                [],
                Object.assign(new Error('duplicate'), { errorNum: 1 }),
            ),
        );
        await request(app.getHttpServer())
            .post(path)
            .send({ ...key, ...fields })
            .expect(409);
        db.delete.mockRejectedValue(
            new QueryFailedError(
                'delete',
                [],
                Object.assign(new Error('referenced'), { errorNum: 2292 }),
            ),
        );
        await request(app.getHttpServer()).delete(recordPath).expect(409);
    });
    it('validates nulls, dates, flags and numeric ranges', async () => {
        if (suffix === 'event_record') {
            for (const invalid of [
                { IS_NG: '2' },
                { IS_NG: null },
                { RUN_NO: 1000 },
                { START_TIME: 'invalid' },
                { SHIFT: null },
            ]) {
                await request(app.getHttpServer())
                    .patch(recordPath)
                    .send(invalid)
                    .expect(400);
            }
            await request(app.getHttpServer())
                .patch(recordPath)
                .send({ DETAIL: null })
                .expect(200);
        } else if (suffix === 'att') {
            await request(app.getHttpServer())
                .delete(path + '/PI000000001/100/jpg')
                .expect(400);
            await request(app.getHttpServer())
                .delete(path + '/PI000000001/abc/jpg')
                .expect(400);
        } else if (suffix === 'cause_mst') {
            await request(app.getHttpServer())
                .patch(recordPath)
                .send({ CAUSE_NAME: 'x'.repeat(301) })
                .expect(400);
            await request(app.getHttpServer())
                .patch(recordPath)
                .send({ STATUS: null })
                .expect(400);
        }
    });
});

it('blocks incomplete composite keys before issuing a write', async () => {
    const db = {
        metadata: {
            primaryColumns: ['PILINE_NO', 'SEQ', 'TYPEFILE'].map(
                (propertyName) => ({ propertyName }),
            ),
        },
        delete: jest.fn(),
    };
    class Attachment {
        PILINE_NO: string;
        SEQ: number;
        TYPEFILE: string;
    }
    const repo = new PilineCrudRepository(
        { manager: { getRepository: () => db } } as unknown as DataSource,
        Attachment,
    );
    await expect(repo.remove({ PILINE_NO: 'PI000000001' })).rejects.toThrow(
        'All primary key fields',
    );
    expect(db.delete).not.toHaveBeenCalled();
});
