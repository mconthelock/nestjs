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
import {
    CreateJigFormDto,
    SaveJigFormDto,
    JigFormKeyDto,
    JigFormFileKeyDto,
} from './dto/jig-form.dto';
import {
    monthStart,
    nextRound,
    validateRange,
    jigSnapshot,
    inspectionTimeline,
} from './jig.utils';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';
import { JigCheckpoint } from 'src/common/Entities/iedoc/table/jig_checkpoint.entity';
import { JigForm } from 'src/common/Entities/iedoc/table/jig_form.entity';
import { JigFormDetail } from 'src/common/Entities/iedoc/table/jig_form_detail.entity';
import { JigFormNg } from 'src/common/Entities/iedoc/table/jig_form_ng.entity';
import { JigFormFile } from 'src/common/Entities/iedoc/table/jig_form_file.entity';
import { MachineAbilityProcess } from 'src/common/Entities/iedoc/table/machine_ability_process.entity';
import { ShopCodeMst } from 'src/common/Entities/iedoc/table/shopcodemst.entity';

const key = {
    NFRMNO: 1,
    VORGNO: '000001',
    CYEAR: '26',
    CYEAR2: '2026',
    NRUNNO: 1,
};

describe('Jig lookup filters', () => {
    it('uses STATUS string 1 for both processes and locations', async () => {
        const processes = { find: jest.fn().mockResolvedValue([]) };
        const locations = { find: jest.fn().mockResolvedValue([]) };
        const ds: any = {
            manager: {
                getRepository: (entity) =>
                    entity === MachineAbilityProcess ? processes : locations,
            },
        };
        const repo = new JigRepository(ds);
        await repo.getMfgProcesses();
        await repo.getLocations();
        expect(processes.find).toHaveBeenCalledWith({
            where: { STATUS: '1' },
            order: { PROCESS: 'ASC', MA_CODE: 'ASC', MID: 'ASC' },
        });
        expect(locations.find).toHaveBeenCalledWith({
            where: { STATUS: '1' },
            order: { SHOPCODE: 'ASC' },
        });
    });
});
function fixture(period = 6) {
    const jig: any = {
        JIG_NO: 'J-001',
        JIG_NAME: 'Original jig',
        START_USE_DATE: new Date(2025, 7, 15),
        JIG_DESC: 'Original description',
        INSPEC_PERIOD: period,
        NEXT_INSPEC_DATE: new Date(2026, 1, 1),
        JIG_STATUS: 'ACTIVE',
    };
    const form: any = {
        ...jig,
        ...key,
        JIG_NO: jig.JIG_NO,
        FORM_TYPE: 'INSPECTION',
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
        master: jig,
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
        findOne: jest.fn(async () => state.master),
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
    it('maps reference columns and lookup primary keys with the supplied Oracle sizes', async () => {
        const ds = new DataSource({
            type: 'oracle',
            entities: [JigMaster, MachineAbilityProcess, ShopCodeMst],
        });
        await (ds as any).buildMetadatas();
        const master = ds.getMetadata(JigMaster);
        expect(
            master.columns.find((c) => c.propertyName === 'REF_CYEAR2'),
        ).toMatchObject({ type: 'varchar2', length: '4', isNullable: true });
        expect(
            master.columns.find((c) => c.propertyName === 'REF_NRUNNO'),
        ).toMatchObject({
            type: 'number',
            precision: 6,
            scale: 0,
            isNullable: true,
        });
        expect(
            ds
                .getMetadata(MachineAbilityProcess)
                .primaryColumns.map((c) => c.propertyName),
        ).toEqual(['MID', 'MA_CODE', 'PROCESS']);
        expect(
            ds
                .getMetadata(MachineAbilityProcess)
                .columns.find((c) => c.propertyName === 'NRUNNO_REF').precision,
        ).toBe(7);
        expect(
            ds
                .getMetadata(ShopCodeMst)
                .primaryColumns.map((c) => c.propertyName),
        ).toEqual(['SHOPCODE']);
    });

    it('validates the complete reference form key on master updates', async () => {
        expect(
            await validate(
                plainToInstance(UpdateJigDto, { REV: 'B', FORM_KEY: key }),
            ),
        ).toHaveLength(0);
        expect(
            (
                await validate(
                    plainToInstance(UpdateJigDto, {
                        FORM_KEY: { CYEAR2: '2026', NRUNNO: 1 },
                    }),
                )
            ).length,
        ).toBeGreaterThan(0);
    });
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
        for (const entity of [JigFormNg, JigFormFile])
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
    it('accepts dictionary fields and a start-use date', async () => {
        const dto = plainToInstance(CreateJigDto, {
            JIG_NO: 'A',
            JIG_NAME: 'Jig',
            INSPEC_PERIOD: 6,
            DWG: 'D-1',
            REV: 'A',
            LOCATION: 'Factory',
            START_USE_DATE: '2026-02-19',
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

describe('Jig form snapshots and approval', () => {
    it('requires START_USE_DATE for registration and preserves its day in history', async () => {
        const { repo, state, manager } = fixture();
        state.master = null; state.status = '1';
        manager.findOneBy.mockResolvedValue(null);
        await expect(repo.createForm('NEW', { ...key, FORM_TYPE: 'CREATE', JIG_NAME: 'New',
            INSPEC_PERIOD: 6, CHECKPOINTS: [{ CHECK_SEQ: 1, CHECK_POINT: 'Visual' }] })).rejects.toThrow('START_USE_DATE');
        expect(manager.insert).not.toHaveBeenCalled();
        expect(jigSnapshot({ JIG_NAME: 'New', INSPEC_PERIOD: 6, START_USE_DATE: '2026-02-19' }).START_USE_DATE).toEqual(new Date(2026, 1, 19));
    });

    it('uses WEBFORM request date and all key columns when listing snapshots', async () => {
        const { repo, manager } = fixture();
        await repo.getFormStates('J-001');
        const [sql, params] = manager.query.mock.calls[0];
        expect(sql).toContain('W.DREQDATE AS FORM_DATE');
        expect(sql).not.toContain('F.CREATE_DATE');
        Object.keys(key).forEach(k => expect(sql).toContain('W.' + k + ' = F.' + k));
        expect(params).toEqual(['J-001']);
    });

    it('maps exactly the supplied form and detail columns, without a master FK', async () => {
        const ds = new DataSource({
            type: 'oracle',
            entities: [JigMaster, JigForm, JigFormDetail],
        });
        await (ds as any).buildMetadatas();
        expect(
            ds
                .getMetadata(JigForm)
                .columns.map((c) => c.propertyName)
                .sort(),
        ).toEqual(
            [
                ...Object.keys(key),
                'FORM_TYPE',
                'JIG_NO',
                'JIG_NAME',
                'DWG',
                'REV',
                'JIG_QTY',
                'PRICE',
                'MAKER',
                'START_USE_DATE',
                'ITEMNO',
                'JIG_DESC',
                'PROCESS_CODE',
                'LOCATION',
                'PIC_EMPNO',
                'INSPEC_PERIOD',
                'REMARK',
            ].sort(),
        );
        expect(
            ds
                .getMetadata(JigFormDetail)
                .columns.map((c) => c.propertyName)
                .sort(),
        ).toEqual(
            [
                ...Object.keys(key),
                'CHECK_SEQ',
                'CHECK_POINT',
                'INSPECTION_TOOL',
                'MIN',
                'MAX',
                'MEASURED_VALUE',
                'UNIT',
                'RESULT',
            ].sort(),
        );
        for (const entity of [JigMaster, JigForm]) {
            expect(
                ds
                    .getMetadata(entity)
                    .columns.find((c) => c.propertyName === 'ITEMNO').length,
            ).toBe('4');
            expect(
                ds
                    .getMetadata(entity)
                    .columns.find((c) => c.propertyName === 'JIG_DESC').length,
            ).toBe('100');
        }
        expect(ds.getMetadata(JigForm).foreignKeys).toHaveLength(0);
    });

    it('rejects old columns and oversized new fields in form requests', async () => {
        const pipe = new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        for (const body of [
            { PARTS: 'old' },
            { ITEMNO: '12345' },
            { JIG_DESC: 'x'.repeat(101) },
            { CHECK_DATE: '2026-01-01' },
            { OVERALL_RESULT: 'OK' },
            { JIG_NAME: null },
            { INSPEC_PERIOD: null },
        ]) {
            await expect(
                pipe.transform(body, {
                    type: 'body',
                    metatype: SaveJigFormDto,
                }),
            ).rejects.toThrow(BadRequestException);
        }
        expect(
            await validate(
                plainToInstance(SaveJigFormDto, {
                    ITEMNO: '0001',
                    JIG_DESC: 'New',
                    DWG: null,
                }),
            ),
        ).toHaveLength(0);
    });

    it('creates a full snapshot before a master exists and does not write master', async () => {
        const { repo, state, manager } = fixture();
        state.master = null;
        state.status = '1';
        manager.findOneBy.mockResolvedValue(null);
        jest.spyOn(repo, 'getForm').mockResolvedValue({} as any);
        await repo.createForm('NEW', {
            ...key,
            FORM_TYPE: 'CREATE',
            JIG_NAME: 'New jig',
            INSPEC_PERIOD: 6,
            START_USE_DATE: '2026-02-19',
            ITEMNO: '0001',
            JIG_DESC: 'Saved text',
            CHECKPOINTS: [{ CHECK_SEQ: 1, CHECK_POINT: 'Visual' }],
        });
        expect(manager.insert).toHaveBeenCalledWith(
            JigForm,
            expect.objectContaining({
                JIG_NO: 'NEW',
                JIG_NAME: 'New jig',
                JIG_DESC: 'Saved text',
            }),
        );
        const snapshot = manager.insert.mock.calls.find(
            (c) => c[0] === JigForm,
        )[1];
        expect(snapshot).not.toHaveProperty('CREATE_DATE');
        expect(snapshot).not.toHaveProperty('SCHEDULE_DATE');
        expect(manager.insert.mock.calls.some((c) => c[0] === JigMaster)).toBe(
            false,
        );
        expect(manager.save).not.toHaveBeenCalled();
    });

    it('copies master fields and checkpoints once for inspection history', async () => {
        const { repo, jig, state, manager } = fixture();
        state.status = '1';
        manager.findOneBy.mockResolvedValue(null);
        jest.spyOn(repo, 'getForm').mockResolvedValue({} as any);
        await repo.createForm(jig.JIG_NO, {
            ...key,
            FORM_TYPE: 'INSPECTION',
            JIG_DESC: 'Reviewed',
        });
        jig.JIG_NAME = 'Later master';
        state.points[0].CHECK_POINT = 'Later checkpoint';
        const snapshot = manager.insert.mock.calls.find(
            (c) => c[0] === JigForm,
        )[1];
        expect(snapshot.JIG_NAME).toBe('Original jig');
        expect(snapshot.JIG_DESC).toBe('Reviewed');
        const detail = manager.insert.mock.calls.find(
            (c) => c[0] === JigFormDetail,
        )[1][0];
        expect(detail.CHECK_POINT).toBe('Diameter');
        expect(detail).not.toHaveProperty('UPDATE_BY');
    });

    it('edits form data and results without altering master or persisting removed columns', async () => {
        const { repo, jig, form, details, state, manager } = fixture();
        state.status = '1';
        await repo.saveForm(key, {
            JIG_NAME: 'Revised jig',
            JIG_DESC: 'New description',
            DETAILS: [{ CHECK_SEQ: 1, MEASURED_VALUE: 3, RESULT: 'OK' }],
            NG: { DEFECT_DETAIL: 'Too large', PLAN_DATE: '2026-04-01' },
            UPDATE_BY: 'J0144',
        });
        expect(form.JIG_NAME).toBe('Revised jig');
        expect(jig.JIG_NAME).toBe('Original jig');
        expect(details[0].RESULT).toBe('NG');
        expect(form).not.toHaveProperty('OVERALL_RESULT');
        expect(details[0]).not.toHaveProperty('UPDATE_DATE');
        expect((await repo.getForm(key)).OVERALL_RESULT).toBe('NG');
        expect(manager.save.mock.calls.some((c) => c[0] === JigMaster)).toBe(
            false,
        );
    });

    it.each(['0', '1', '3'])(
        'rejects finishing workflow status %s',
        async (status) => {
            const { repo, state, manager } = fixture();
            state.status = status;
            await expect(repo.finishForm(key)).rejects.toThrow(
                ConflictException,
            );
            expect(manager.save).not.toHaveBeenCalled();
        },
    );

    it('inserts master after CREATE approval, using start month plus period', async () => {
        const { repo, state, form, manager } = fixture();
        state.master = null;
        form.FORM_TYPE = 'CREATE';
        form.START_USE_DATE = new Date(2026, 1, 19);
        const result = await repo.finishForm(key, 'J0144');
        expect(result.jig).toMatchObject({
            NEXT_INSPEC_DATE: new Date(2026, 7, 1),
            REF_CYEAR2: '2026',
            REF_NRUNNO: 1,
            JIG_STATUS: 'ACTIVE',
        });
        expect(manager.insert).toHaveBeenCalledWith(JigMaster, result.jig);
        state.master = result.jig;
        expect((await repo.finishForm(key)).applied).toBe(false);
    });

    it.each([6, 12])(
        'advances the original February due by %i months only once',
        async (period) => {
            const { repo, jig, form, manager } = fixture(period);
            form.JIG_NAME = 'Approved snapshot';
            expect((await repo.finishForm(key)).applied).toBe(true);
            expect(jig.NEXT_INSPEC_DATE).toEqual(new Date(2026, 1 + period, 1));
            expect(jig.JIG_NAME).toBe('Approved snapshot');
            expect(jig).toMatchObject({ REF_CYEAR2: '2026', REF_NRUNNO: 1 });
            expect((await repo.finishForm(key)).applied).toBe(false);
            expect(manager.save).toHaveBeenCalledTimes(1);
            expect(manager.findOne.mock.calls[0][1].lock.mode).toBe(
                'pessimistic_write',
            );
        },
    );

    it('does not replay an older approved form after a later round was applied', async () => {
        const { repo, jig } = fixture();
        jig.REF_CYEAR2 = '2026';
        jig.REF_NRUNNO = 2;
        jig.NEXT_INSPEC_DATE = new Date(2027, 1, 1);
        expect((await repo.finishForm(key)).applied).toBe(false);
        expect(jig.NEXT_INSPEC_DATE).toEqual(new Date(2027, 1, 1));
    });

    it('re-reads master after waiting for another CREATE finish to commit', async () => {
        const { repo, jig, form, manager } = fixture();
        form.FORM_TYPE = 'CREATE';
        jig.REF_CYEAR2 = '2026'; jig.REF_NRUNNO = 1;
        manager.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(jig);
        expect((await repo.finishForm(key)).applied).toBe(false);
        expect(manager.insert).not.toHaveBeenCalled();
        expect(manager.save).not.toHaveBeenCalled();
    });

    it.each(['1', '2'])(
        'blocks another round while the previous status %s is unapplied',
        async (status) => {
            const { repo, form, state, manager } = fixture();
            state.status = '1';
            state.forms = [{ ...form, FORM_STATUS: status }];
            manager.findOneBy.mockResolvedValue(null);
            await expect(
                repo.createForm('J-001', {
                    ...key,
                    NRUNNO: 2,
                    FORM_TYPE: 'INSPECTION',
                }),
            ).rejects.toThrow(ConflictException);
            expect(manager.insert).not.toHaveBeenCalled();
        },
    );

    it('rejects ambiguous reference pairs and finishing before an earlier form', async () => {
        const { repo, form, state } = fixture();
        state.forms = [{ ...form, VORGNO: 'OTHER', FORM_STATUS: '2' }];
        await expect(repo.finishForm(key)).rejects.toThrow('Ambiguous');
        state.forms = [{ ...form, NRUNNO: 0, FORM_STATUS: '2' }];
        await expect(repo.finishForm(key)).rejects.toThrow('previous form');
    });

    it('requires complete results and an NG corrective action', async () => {
        const { repo, details, state } = fixture();
        details[0].MEASURED_VALUE = null;
        await expect(repo.finishForm(key)).rejects.toThrow(ConflictException);
        details[0].MEASURED_VALUE = 3;
        details[0].RESULT = 'NG';
        await expect(repo.finishForm(key)).rejects.toThrow(ConflictException);
        state.ng = { DEFECT_DETAIL: 'Too large', PLAN_DATE: new Date() };
        expect((await repo.finishForm(key)).applied).toBe(true);
    });

    it('locks approved forms and their attachments against edits', async () => {
        const { repo, manager } = fixture();
        await expect(
            repo.saveForm(key, { JIG_NAME: 'Change' }),
        ).rejects.toThrow(ConflictException);
        await expect(
            repo.putFile(key, {
                FILE_SEQ: 1,
                FILE_NAME: 'a.pdf',
                FILE_PATH: 'a.pdf',
            }),
        ).rejects.toThrow(ConflictException);
        expect(manager.save).not.toHaveBeenCalled();
    });

    it('routes legacy create/update entry points into forms rather than master writes', async () => {
        const repo: any = {
            createForm: jest.fn(),
            getForm: jest.fn().mockResolvedValue({ JIG_NO: 'A' }),
            saveForm: jest.fn(),
        };
        const service = new JigService(repo);
        const dto: any = {
            ...key,
            FORM_TYPE: 'CREATE',
            JIG_NO: 'A',
            JIG_NAME: 'New',
            INSPEC_PERIOD: 6,
            START_USE_DATE: '2026-02-19',
        };
        service.createJig(dto);
        expect(repo.createForm).toHaveBeenCalledWith('A', dto);
        await service.updateJig('A', { FORM_KEY: key, JIG_DESC: 'Revised' });
        expect(repo.saveForm).toHaveBeenCalledWith(key, {
            JIG_DESC: 'Revised',
        });
        await expect(service.updateJig('B', { FORM_KEY: key })).rejects.toThrow(
            BadRequestException,
        );
    });
});

describe('Jig dashboard and calendar', () => {
    it('uses the calendar start-use month, including year rollovers', () => {
        const snapshot = jigSnapshot({
            JIG_NAME: 'A',
            INSPEC_PERIOD: 6,
            START_USE_DATE: '2026-09-01',
        });
        expect(snapshot.START_USE_DATE).toEqual(new Date(2026, 8, 1));
        expect(nextRound(snapshot.START_USE_DATE, 6)).toEqual(
            new Date(2027, 2, 1),
        );
    });

    it('reconstructs applied rounds using each approved snapshot period and excludes rejected forms', () => {
        const { jig, form } = fixture();
        jig.REF_CYEAR2 = '2026';
        jig.REF_NRUNNO = 2;
        jig.NEXT_INSPEC_DATE = new Date(2027, 7, 1);
        const history = inspectionTimeline(jig, [
            { ...form, NRUNNO: 1, INSPEC_PERIOD: 6, FORM_STATUS: '2' },
            { ...form, NRUNNO: 2, INSPEC_PERIOD: 12, FORM_STATUS: '2' },
            { ...form, NRUNNO: 3, INSPEC_PERIOD: 12, FORM_STATUS: '3' },
            { ...form, NRUNNO: 4, INSPEC_PERIOD: 12, FORM_STATUS: '1' },
        ]);
        expect(history.find((f) => f.NRUNNO === 1).SCHEDULE_DATE).toEqual(
            new Date(2026, 1, 1),
        );
        expect(history.find((f) => f.NRUNNO === 2).SCHEDULE_DATE).toEqual(
            new Date(2026, 7, 1),
        );
        expect(history.find((f) => f.NRUNNO === 3).SCHEDULE_DATE).toBeNull();
        expect(history.find((f) => f.NRUNNO === 4).SCHEDULE_DATE).toEqual(
            new Date(2027, 7, 1),
        );
    });

    it.each(['1', '2'])(
        'shows a CREATE form with status %s on the dashboard before master exists',
        async (status) => {
            const { form } = fixture();
            const repo: any = {
                getDashboardMaster: jest.fn().mockResolvedValue([]),
                getFormStates: jest
                    .fn()
                    .mockResolvedValue([
                        {
                            ...form,
                            FORM_TYPE: 'CREATE',
                            START_USE_DATE: new Date(2026, 1, 19),
                            FORM_DATE: new Date(2026, 3, 1),
                            FORM_STATUS: status,
                            DETAIL_COUNT: 1,
                        },
                    ]),
            };
            const result = await new JigService(repo).getDashboard(2026);
            expect(result.summary.total).toBe(1);
            expect(result.items[0].NEXT_INSPEC_DATE).toEqual(
                new Date(2026, 7, 1),
            );
            expect(result.items[0].DASHBOARD_STATUS).toBe(
                status === '2' ? 'AWAITING_SYNC' : 'PENDING',
            );
            expect(result.items[0].CURRENT_FORM.NRUNNO).toBe(1);
        },
    );
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
                        REF_CYEAR2: '2026',
                        REF_NRUNNO: 1,
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
                getFormStates: jest.fn().mockResolvedValue([
                    {
                        ...key,
                        JIG_NO: 'A',
                        FORM_TYPE: 'INSPECTION',
                        INSPEC_PERIOD: 6,
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
        getIePics: jest.fn().mockResolvedValue([
            { SEMPNO: 'J0144', SNAME: 'Example employee', SPOSNAME: 'Engineer' },
        ]),
        getMfgProcesses: jest
            .fn()
            .mockResolvedValue([
                {
                    MID: 1,
                    MA_CODE: 'A',
                    PROCESS: 'H6AS',
                    STATUS: '1',
                    ACTION_STATUS: '0',
                },
            ]),
        getLocations: jest
            .fn()
            .mockResolvedValue([
                { SHOPCODE: '01', SHOPDESC: 'Shop 1', STATUS: '1' },
            ]),
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

    it('routes dropdown lookups before the dynamic jig number route', async () => {
        const processes = await request(app.getHttpServer())
            .get('/iedoc/jig/mfg-processes')
            .expect(200);
        expect(processes.body[0].PROCESS).toBe('H6AS');
        const locations = await request(app.getHttpServer())
            .get('/iedoc/jig/locations')
            .expect(200);
        expect(locations.body[0].SHOPCODE).toBe('01');
        const pics = await request(app.getHttpServer())
            .get('/iedoc/jig/ie-pics')
            .expect(200);
        expect(pics.body).toEqual([
            { SEMPNO: 'J0144', SNAME: 'Example employee', SPOSNAME: 'Engineer' },
        ]);
        expect(service.getIePics).toHaveBeenCalledTimes(1);
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
