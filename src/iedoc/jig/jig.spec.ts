import {
    BadRequestException,
    ConflictException,
    ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JigController } from './jig.controller';
import { JigRepository } from './jig.repository';
import { JigService } from './jig.service';
import { CreateJigDto } from './dto/create-jig.dto';
import { UpdateJigDto } from './dto/update-jig.dto';
import { ReplaceCheckpointsDto } from './dto/checkpoint.dto';
import { JigFormKeyDto, JigFormFileKeyDto } from './dto/jig-form.dto';
import { monthStart, nextRound, validateRange } from './jig.utils';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';
import { JigCheckpoint } from 'src/common/Entities/iedoc/table/jig_checkpoint.entity';
import { JigForm } from 'src/common/Entities/iedoc/table/jig_form.entity';
import { JigFormDetail } from 'src/common/Entities/iedoc/table/jig_form_detail.entity';
import { JigFormNg } from 'src/common/Entities/iedoc/table/jig_form_ng.entity';
import { JigFormFile } from 'src/common/Entities/iedoc/table/jig_form_file.entity';

const key = {
    NFRMNO: 1,
    VORGNO: '000001',
    CYEAR: '26',
    CYEAR2: '2026',
    NRUNNO: 1,
};
function fixture(period = 6) {
    const jig: any = {
        JIG_NO: 'J-001',
        INSPEC_PERIOD: period,
        NEXT_INSPEC_DATE: new Date(2026, 1, 1),
        JIG_STATUS: 'ACTIVE',
    };
    const form: any = {
        ...key,
        JIG_NO: jig.JIG_NO,
        FORM_TYPE: 'INSPECTION',
        SCHEDULE_DATE: new Date(2026, 1, 1),
        CHECK_DATE: new Date(2026, 2, 12),
        INSPECTOR_EMPNO: 'J0144',
        OVERALL_RESULT: 'OK',
    };
    const details: any[] = [
        {
            ...key,
            CHECK_SEQ: 1,
            CHECK_POINT: 'Diameter',
            MIN: 1,
            MAX: 2,
            MEASURED_VALUE: 1.5,
            RESULT: 'OK',
        },
    ];
    const state: any = {
        status: '2',
        ng: null,
        forms: [],
        points: [
            {
                CHECK_SEQ: 1,
                CHECK_POINT: 'Diameter',
                MIN: 1,
                MAX: 2,
                UNIT: 'mm',
            },
        ],
    };
    const manager: any = {
        query: jest.fn(async (sql: string) =>
            sql.startsWith('SELECT CST')
                ? [{ CST: state.status }]
                : state.forms,
        ),
        findOne: jest.fn(async () => jig),
        findOneBy: jest.fn(async (entity: any) =>
            entity === JigForm ? form : entity === JigFormNg ? state.ng : null,
        ),
        findBy: jest.fn(async () => details),
        find: jest.fn(async (entity: any) =>
            entity === JigCheckpoint
                ? state.points
                : entity === JigFormDetail
                  ? details
                  : [],
        ),
        create: jest.fn((_entity, data) => data),
        insert: jest.fn(async () => ({})),
        save: jest.fn(async (_entity, data) => data),
        delete: jest.fn(async () => ({ affected: 1 })),
    };
    const ds: any = {
        manager,
        transaction: async (callback) => callback(manager),
    };
    return { repo: new JigRepository(ds), jig, form, details, state, manager };
}

describe('Jig dictionary and validation', () => {
    it('builds Oracle metadata for six tables with complete composite foreign keys', async () => {
        const ds = new DataSource({
            type: 'oracle',
            entities: [
                JigMaster,
                JigCheckpoint,
                JigForm,
                JigFormDetail,
                JigFormNg,
                JigFormFile,
            ],
        });
        await (ds as any).buildMetadatas();
        const master = ds.getMetadata(JigMaster);
        expect(
            master.columns.find((c) => c.propertyName === 'DWG').length,
        ).toBe('100');
        expect(
            master.columns.some((c) => c.propertyName === 'DRAWING_NO'),
        ).toBe(false);
        expect(
            master.columns.find((c) => c.propertyName === 'NEXT_INSPEC_DATE')
                .isNullable,
        ).toBe(true);
        expect(
            master.columns.find((c) => c.propertyName === 'PRICE').scale,
        ).toBe(2);
        expect(ds.getMetadata(JigFormNg).primaryColumns).toHaveLength(5);
        for (const entity of [JigFormDetail, JigFormFile])
            expect(ds.getMetadata(entity).primaryColumns).toHaveLength(6);
        for (const entity of [JigFormDetail, JigFormNg, JigFormFile])
            expect(ds.getMetadata(entity).foreignKeys[0].columnNames).toEqual(
                Object.keys(key),
            );
    });

    it.each([0, -1, 1.5, 1000])(
        'rejects invalid inspection period %s',
        async (period) => {
            const dto = plainToInstance(CreateJigDto, {
                JIG_NO: 'A',
                JIG_NAME: 'Jig',
                INSPEC_PERIOD: period,
            });
            expect(
                (await validate(dto)).some(
                    (e) => e.property === 'INSPEC_PERIOD',
                ),
            ).toBe(true);
        },
    );
    it('accepts dictionary fields and a nullable draft schedule', async () => {
        const dto = plainToInstance(CreateJigDto, {
            JIG_NO: 'A',
            JIG_NAME: 'Jig',
            INSPEC_PERIOD: 6,
            DWG: 'D-1',
            REV: 'A',
            LOCATION: 'Factory',
            NEXT_INSPEC_DATE: null,
        });
        expect(await validate(dto)).toHaveLength(0);
    });
    it('rejects clearing required master fields through PATCH', async () => {
        const dto = plainToInstance(UpdateJigDto, {
            JIG_NAME: null,
            INSPEC_PERIOD: null,
        });
        expect((await validate(dto)).map((e) => e.property)).toEqual(
            expect.arrayContaining(['JIG_NAME', 'INSPEC_PERIOD']),
        );
    });
    it('rejects duplicate checkpoints, invalid ranges and overlong employee codes', async () => {
        const dto = plainToInstance(ReplaceCheckpointsDto, {
            CHECKPOINTS: [
                { CHECK_SEQ: 1, CHECK_POINT: 'A' },
                { CHECK_SEQ: 1, CHECK_POINT: 'B' },
            ],
        });
        expect((await validate(dto)).length).toBeGreaterThan(0);
        expect(() => validateRange({ MIN: 2, MAX: 1 })).toThrow(
            BadRequestException,
        );
        expect(
            (
                await validate(
                    plainToInstance(CreateJigDto, {
                        JIG_NO: 'A',
                        JIG_NAME: 'Jig',
                        INSPEC_PERIOD: 6,
                        PIC_EMPNO: '123456',
                    }),
                )
            ).length,
        ).toBeGreaterThan(0);
    });
    it('transforms all five route keys and the file sequence without losing leading zeroes', async () => {
        const pipe = new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        const parsed = await pipe.transform(
            { ...key, NFRMNO: '1', NRUNNO: '1', FILE_SEQ: '2' },
            { type: 'param', metatype: JigFormFileKeyDto },
        );
        expect(parsed).toEqual({ ...key, FILE_SEQ: 2 });
        await expect(
            pipe.transform(
                { ...key, NRUNNO: 'bad' },
                { type: 'param', metatype: JigFormKeyDto },
            ),
        ).rejects.toThrow(BadRequestException);
    });
});

describe('Jig approval and form data', () => {
    it.each([6, 12])(
        'advances the original February round by %i months, regardless of a March check date, once only',
        async (period) => {
            const { repo, jig, manager } = fixture(period);
            const result = await repo.finishForm(key, 'J0144');
            expect(result.applied).toBe(true);
            expect(jig.NEXT_INSPEC_DATE).toEqual(new Date(2026, 1 + period, 1));
            expect(manager.findOne.mock.calls[0][1].lock.mode).toBe(
                'pessimistic_write',
            );
            expect(manager.query.mock.calls[0][0]).toContain('FOR UPDATE');
            expect((await repo.finishForm(key)).applied).toBe(false);
            expect(manager.save).toHaveBeenCalledTimes(1);
        },
    );
    it.each(['0', '1', '3'])(
        'does not finish WEBFORM status %s',
        async (status) => {
            const { repo, state, manager } = fixture();
            state.status = status;
            await expect(repo.finishForm(key)).rejects.toThrow(
                ConflictException,
            );
            expect(manager.save).not.toHaveBeenCalled();
        },
    );
    it('activates an approved registration without advancing the first due month', async () => {
        const { repo, jig, form } = fixture();
        jig.JIG_STATUS = 'PENDING';
        form.FORM_TYPE = 'CREATE';
        expect((await repo.finishForm(key)).applied).toBe(true);
        expect(jig.JIG_STATUS).toBe('ACTIVE');
        expect(jig.NEXT_INSPEC_DATE).toEqual(new Date(2026, 1, 1));
    });
    it('requires every result, measured values for numerical checks, and an NG action', async () => {
        const { repo, form, details, state } = fixture();
        details[0].MEASURED_VALUE = null;
        await expect(repo.finishForm(key)).rejects.toThrow(ConflictException);
        details[0].MEASURED_VALUE = 3;
        details[0].RESULT = 'NG';
        form.OVERALL_RESULT = 'NG';
        await expect(repo.finishForm(key)).rejects.toThrow(ConflictException);
        state.ng = {
            DEFECT_DETAIL: 'Diameter exceeds limit',
            PLAN_DATE: new Date(),
        };
        expect((await repo.finishForm(key)).applied).toBe(true);
    });
    it('snapshots checkpoint definitions rather than linking mutable text', async () => {
        const { repo, manager, state } = fixture();
        state.status = '1';
        manager.findOneBy.mockImplementation(async (entity) =>
            entity === JigForm ? null : null,
        );
        jest.spyOn(repo, 'getForm').mockResolvedValue({} as any);
        await repo.createForm('J-001', {
            ...key,
            FORM_TYPE: 'INSPECTION',
            SCHEDULE_DATE: '2026-02-01',
        });
        const snapshot = manager.insert.mock.calls.find(
            (c) => c[0] === JigFormDetail,
        )[1][0];
        state.points[0].CHECK_POINT = 'Changed';
        expect(snapshot.CHECK_POINT).toBe('Diameter');
        expect(snapshot.MEASURED_VALUE).toBeNull();
        expect(snapshot.NRUNNO).toBe(key.NRUNNO);
    });
    it('blocks duplicate rounds even when linked to a different WEBFORM key', async () => {
        const { repo, manager, state, form } = fixture();
        state.status = '1';
        manager.findOneBy.mockResolvedValue(null);
        state.forms = [{ ...form, FORM_STATUS: '1', NRUNNO: 99 }];
        await expect(
            repo.createForm('J-001', {
                ...key,
                FORM_TYPE: 'INSPECTION',
                SCHEDULE_DATE: '2026-02-01',
            }),
        ).rejects.toThrow(ConflictException);
        expect(manager.insert).not.toHaveBeenCalled();
    });
    it('computes numerical NG and preserves the original checkpoint definition', async () => {
        const { repo, state, details, form, manager } = fixture();
        state.status = '1';
        jest.spyOn(repo, 'getForm').mockResolvedValue({} as any);
        await repo.saveForm(key, {
            DETAILS: [{ CHECK_SEQ: 1, MEASURED_VALUE: 3, RESULT: 'OK' }],
            NG: { DEFECT_DETAIL: 'Too large', PLAN_DATE: '2026-04-01' },
            UPDATE_BY: 'J0144',
        });
        expect(details[0].RESULT).toBe('NG');
        expect(details[0].CHECK_POINT).toBe('Diameter');
        expect(form.OVERALL_RESULT).toBe('NG');
        expect(manager.save.mock.calls.some((c) => c[0] === JigFormNg)).toBe(
            true,
        );
    });
    it('rejects modifying approved forms and attaching files to them', async () => {
        const { repo, manager } = fixture();
        await expect(repo.saveForm(key, { DETAILS: [] })).rejects.toThrow(
            ConflictException,
        );
        await expect(
            repo.putFile(key, {
                FILE_SEQ: 1,
                FILE_NAME: 'a.pdf',
                FILE_PATH: 'stored/a.pdf',
            }),
        ).rejects.toThrow(ConflictException);
        expect(manager.save).not.toHaveBeenCalled();
    });
    it('uses all five key columns and bound parameters for WEBFORM lookup', async () => {
        const { repo, manager } = fixture();
        await repo.finishForm(key);
        const [sql, params] = manager.query.mock.calls[0];
        Object.keys(key).forEach((k) => expect(sql).toContain(k + ' = :'));
        expect(params).toEqual(Object.values(key));
    });
});

describe('Jig dashboard and calendar', () => {
    it('normalizes month-end input and rolls across years', () => {
        expect(monthStart('2026-01-31')).toEqual(new Date(2026, 0, 1));
        expect(nextRound(new Date(2026, 7, 31), 6)).toEqual(
            new Date(2027, 1, 1),
        );
    });
    it('handles drafts with no due date and separates two inspection rounds in a fiscal year', async () => {
        jest.useFakeTimers().setSystemTime(new Date(2026, 8, 8));
        try {
            const repo: any = {
                getDashboardMaster: jest.fn().mockResolvedValue([
                    {
                        JIG_NO: 'A',
                        JIG_STATUS: 'ACTIVE',
                        INSPEC_PERIOD: 6,
                        NEXT_INSPEC_DATE: new Date(2026, 9, 1),
                        CREATE_DATE: new Date(2025, 0, 1),
                        CHECKPOINT_COUNT: 1,
                    },
                    {
                        JIG_NO: 'B',
                        JIG_STATUS: 'DRAFT',
                        INSPEC_PERIOD: 12,
                        NEXT_INSPEC_DATE: null,
                        CREATE_DATE: new Date(2026, 8, 1),
                        CHECKPOINT_COUNT: 0,
                    },
                ]),
                getFormStates: jest
                    .fn()
                    .mockResolvedValue([
                        {
                            ...key,
                            JIG_NO: 'A',
                            FORM_TYPE: 'INSPECTION',
                            SCHEDULE_DATE: new Date(2026, 3, 1),
                            FORM_STATUS: '2',
                        },
                    ]),
            };
            const dashboard = await new JigService(repo).getDashboard(2026);
            expect(dashboard.summary).toMatchObject({
                total: 2,
                completed: 1,
                completedRounds: 1,
                dueSoon: 1,
                overdue: 0,
                newJig: 1,
            });
            expect(
                dashboard.items[0].SCHEDULES.map((s) => [
                    s.SCHEDULE_DATE,
                    s.STATUS,
                ]),
            ).toEqual([
                ['2026-04-01', 'COMPLETED'],
                ['2026-10-01', 'PLANNED'],
            ]);
            expect(dashboard.items[1].DASHBOARD_STATUS).toBe('DRAFT');
            expect(dashboard.items[1].DUE_STATUS).toBeNull();
        } finally {
            jest.useRealTimers();
        }
    });
});

describe('Jig HTTP contracts', () => {
    let app: any;
    const service = {
        finishForm: jest.fn().mockResolvedValue({ applied: true }),
        deleteFile: jest.fn().mockResolvedValue({ deleted: true }),
        createJig: jest.fn().mockResolvedValue({ JIG_STATUS: 'DRAFT' }),
    };
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            controllers: [JigController],
            providers: [{ provide: JigService, useValue: service }],
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({ transform: true, whitelist: true }),
        );
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });

    it('binds the composite form key on finish and file deletion routes', async () => {
        await request(app.getHttpServer())
            .post('/iedoc/jig/forms/1/000001/26/2026/1/finish')
            .send({ UPDATE_BY: 'J0144' })
            .expect(201);
        expect(service.finishForm).toHaveBeenCalledWith(key, {
            UPDATE_BY: 'J0144',
        });
        await request(app.getHttpServer())
            .delete('/iedoc/jig/forms/1/000001/26/2026/1/files/2')
            .expect(200);
        expect(service.deleteFile).toHaveBeenCalledWith(
            { ...key, FILE_SEQ: 2 },
            2,
        );
    });
    it('validates dictionary bounds before invoking create', async () => {
        await request(app.getHttpServer())
            .post('/iedoc/jig')
            .send({ JIG_NO: 'A', JIG_NAME: 'Test', INSPEC_PERIOD: 0 })
            .expect(400);
        expect(service.createJig).not.toHaveBeenCalled();
    });
    it('does not expose the old master-only finish endpoint', async () => {
        await request(app.getHttpServer())
            .patch('/iedoc/jig/J-001/finish')
            .send({ SCHEDULE_DATE: '2026-02-01' })
            .expect(404);
    });
});
