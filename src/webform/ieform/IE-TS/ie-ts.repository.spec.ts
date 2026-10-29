import { transactionContext } from 'src/common/interceptors/transaction-context';
import { PROC_TSHEADFORM } from 'src/common/Entities/webform/table/PROC_TSHEADFORM.entity';
import { PROC_TSDETFORM } from 'src/common/Entities/webform/table/PROC_TSDETFORM.entity';
import { PROC_TSATTFILE } from 'src/common/Entities/webform/table/PROC_TSATTFILE.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { IeTsRepository } from './ie-ts.repository';
import { IeTsService } from './ie-ts.service';
import { DataSource, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'FORM', schema: 'WEBFORM' })
class LockableForm {
    @PrimaryColumn({ type: 'number' }) NFRMNO: number;
    @PrimaryColumn({ type: 'varchar2', length: 6 }) VORGNO: string;
    @PrimaryColumn({ type: 'char', length: 2 }) CYEAR: string;
    @PrimaryColumn({ type: 'char', length: 4 }) CYEAR2: string;
    @PrimaryColumn({ type: 'number' }) NRUNNO: number;
}

const key = {
    NFRMNO: 31,
    VORGNO: '051401',
    CYEAR: '26',
    CYEAR2: '2026',
    NRUNNO: 42,
};

function setup() {
    const repositories = new Map<any, any>();
    for (const entity of [
        PROC_TSHEADFORM,
        PROC_TSDETFORM,
        PROC_TSATTFILE,
        FORM,
    ]) {
        const qb = {
            where: jest.fn().mockReturnThis(),
            setLock: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(key),
        };
        repositories.set(entity, {
            insert: jest.fn().mockResolvedValue({}),
            delete: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockResolvedValue([]),
            countBy: jest.fn().mockResolvedValue(0),
            createQueryBuilder: jest.fn().mockReturnValue(qb),
        });
    }
    const manager = {
        getRepository: jest.fn((entity) => repositories.get(entity)),
        query: jest.fn().mockResolvedValue([{ MATCH_COUNT: 0 }]),
    };
    const state = { committed: false, rolledBack: false };
    const ds: any = {
        manager: {
            getRepository: jest.fn(() => {
                throw new Error('Write escaped transaction');
            }),
        },
        transaction: jest.fn(async (callback) => {
            try {
                const result = await callback(manager);
                state.committed = true;
                return result;
            } catch (error) {
                state.rolledBack = true;
                throw error;
            }
        }),
    };
    (manager as any).connection = ds;
    const repo = new IeTsRepository(ds);
    return { repositories, manager, ds, state, repo };
}

describe('TS repository transaction boundary', () => {
    it('uses IS NULL to match Oracle empty GNO/LNO without binding undefined', async () => {
        const { repo, manager } = setup();
        manager.query.mockResolvedValue([{ MATCH_COUNT: 1 }]);
        expect(
            await repo.transaction(() =>
                repo.processExists({
                    DWG: 'YA154D379',
                    GNO: '',
                    LNO: undefined,
                    ITEM: '125',
                    PROCID_OLD: 'G1SHE',
                    PROCID: 'G1SHE',
                }),
            ),
        ).toBe(true);
        const [sql, binds] = manager.query.mock.calls[0];
        expect(sql).toContain('TRIM(GNO) IS NULL');
        expect(sql).toContain('TRIM(LNO) IS NULL');
        expect(binds).toEqual(['YA154D379', 'G1SHE']);
    });
    it('checks only DWG/GNO/LNO/PROCID_OLD across existing details, excluding ITEM and form identity', async () => {
        const { repo, manager } = setup();
        manager.query.mockResolvedValue([{ MATCH_COUNT: '2' }]);
        const duplicate = await repo.transaction(() =>
            repo.processExists({
                DWG: 'DWG000001',
                GNO: '001',
                LNO: '001',
                ITEM: '999',
                PROCID_OLD: 'OLD001',
                PROCID: 'NEW001',
            }),
        );
        expect(duplicate).toBe(true);
        const [sql, binds] = manager.query.mock.calls[0];
        expect(sql).toContain('IEDOC.PROC_TSDETFORM');
        expect(sql).not.toMatch(/ITEM|NFRMNO|VORGNO|CYEAR|NRUNNO/);
        expect(binds).toEqual(['DWG000001', '001', '001', 'OLD001']);
    });
    it('generates Oracle FOR UPDATE without FETCH/OFFSET pagination', async () => {
        const ds = new DataSource({ type: 'oracle', entities: [LockableForm] });
        // Build metadata only; no database connection or real data writes.
        await (ds as any).buildMetadatas();
        const oracleRepository = ds.getRepository(LockableForm);
        const captured: string[] = [];
        const original =
            oracleRepository.createQueryBuilder.bind(oracleRepository);
        jest.spyOn(oracleRepository, 'findOne').mockImplementation(
            async (options) => {
                // Installed EntityManager.findOne adds take: 1 before executing.
                captured.push(
                    original()
                        .setFindOptions({ ...options, take: 1 })
                        .getSql(),
                );
                return key;
            },
        );
        jest.spyOn(oracleRepository, 'createQueryBuilder').mockImplementation(
            (...args) => {
                const qb = original(...args);
                jest.spyOn(qb, 'getOne').mockImplementation(async () => {
                    captured.push(qb.getSql());
                    return key;
                });
                return qb;
            },
        );
        const { repo, manager } = setup();
        manager.getRepository.mockReturnValue(oracleRepository);
        await repo.transaction(() => repo.requireForm(key));
        expect(captured[0]).toContain('FOR UPDATE');
        expect(captured[0]).not.toMatch(/FETCH|OFFSET|ROWNUM/i);
        for (const field of Object.keys(key))
            expect(captured[0]).toContain(field);
    });
    it('shares transaction manager between Form creation and every TS repository', async () => {
        const { repo, repositories, manager, state } = setup();
        const forms: any = {
            create: jest.fn(async () => {
                expect(transactionContext.getStore()?.manager).toBe(manager);
                return { status: true, data: key };
            }),
        };
        const service = new IeTsService(repo, forms);
        await service.autoInsert(
            [
                {
                    NFRMNO: 31,
                    VORGNO: '051401',
                    CYEAR: '26',
                    REQUEST_BY: '12345',
                    INPUT_BY: '12345',
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
                },
            ],
            'ip',
        );
        expect(repositories.get(PROC_TSHEADFORM).insert).toHaveBeenCalledWith([
            {
                ...key,
                SEQ: '001',
                INPUTDATE: undefined,
                DWGNO: 'DWG000001',
                GNO: '001',
                LNO: '001',
                ITEMNO: '001',
            },
        ]);
        expect(repositories.get(PROC_TSDETFORM).insert).toHaveBeenCalledWith([
            {
                ...key,
                SEQ: '001',
                PROCID: 'P1',
                PROCID_OLD: 'P0',
                SEQ_PROC: '01',
                DWG: 'DWG000001',
                GNO: '001',
                LNO: '001',
            },
        ]);
        expect(repositories.get(PROC_TSATTFILE).insert).not.toHaveBeenCalled();
        expect(manager.query.mock.calls[0][0]).toBe(
            'LOCK TABLE WEBFORM.FORM IN SHARE ROW EXCLUSIVE MODE',
        );
        expect(manager.query.mock.calls[1][0]).toBe(
            'LOCK TABLE IEDOC.PROC_TSDETFORM IN SHARE ROW EXCLUSIVE MODE',
        );
        expect(manager.query.mock.calls[2][0]).toContain('SELECT COUNT(*)');
        expect(state).toEqual({ committed: true, rolledBack: false });
        expect(transactionContext.getStore()).toBeUndefined();
    });
    it('propagates a failed detail insert to the same transaction and never commits', async () => {
        const { repo, repositories, state } = setup();
        repositories
            .get(PROC_TSDETFORM)
            .insert.mockRejectedValue(new Error('detail insert failed'));
        const service = new IeTsService(repo, {
            create: jest.fn().mockResolvedValue({ status: true, data: key }),
        } as any);
        await expect(
            service.autoInsert(
                [
                    {
                        NFRMNO: 31,
                        VORGNO: '051401',
                        CYEAR: '26',
                        REQUEST_BY: '12345',
                        INPUT_BY: '12345',
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
                    },
                ],
                'ip',
            ),
        ).rejects.toThrow('detail insert failed');
        expect(state).toEqual({ committed: false, rolledBack: true });
        expect(repositories.get(PROC_TSATTFILE).insert).not.toHaveBeenCalled();
        expect(transactionContext.getStore()).toBeUndefined();
    });
    it('replaces only the specified TS form, deleting children before headers', async () => {
        const { repo, repositories } = setup();
        await repo.transaction(() =>
            repo.replace({ ...key, HEADERS: [{ SEQ: '002' }] }),
        );
        const details = repositories.get(PROC_TSDETFORM);
        const files = repositories.get(PROC_TSATTFILE);
        const headers = repositories.get(PROC_TSHEADFORM);
        for (const target of [details, files, headers])
            expect(target.delete).toHaveBeenCalledWith(key);
        expect(details.delete.mock.invocationCallOrder[0]).toBeLessThan(
            headers.delete.mock.invocationCallOrder[0],
        );
        expect(files.delete.mock.invocationCallOrder[0]).toBeLessThan(
            headers.delete.mock.invocationCallOrder[0],
        );
        expect(headers.delete.mock.invocationCallOrder[0]).toBeLessThan(
            headers.insert.mock.invocationCallOrder[0],
        );
        expect(headers.insert).toHaveBeenCalledWith([
            { ...key, SEQ: '002', INPUTDATE: undefined },
        ]);
        expect(repositories.get(FORM).delete).not.toHaveBeenCalled();
    });
    it('locks the complete FORM key and refuses nonexistent forms', async () => {
        const { repo, repositories } = setup();
        const form = repositories.get(FORM);
        const qb = form.createQueryBuilder();
        qb.getOne.mockResolvedValue(null);
        await expect(
            repo.transaction(() => repo.requireForm(key)),
        ).rejects.toThrow('WEBFORM.FORM not found');
        expect(qb.where).toHaveBeenCalledWith(key);
        expect(qb.setLock).toHaveBeenCalledWith('pessimistic_write');
    });
});
