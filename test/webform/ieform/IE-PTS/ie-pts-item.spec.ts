import { groupTsForms } from 'src/webform/ieform/IE-PTS/ts-process-auto.utils';
import { IePtsService } from 'src/webform/ieform/IE-PTS/ie-pts.service';
import { IePtsRepository } from 'src/webform/ieform/IE-PTS/ie-pts.repository';
import { transactionContext } from 'src/common/interceptors/transaction-context';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';
const key = {
    NFRMNO: 4,
    VORGNO: '051401',
    CYEAR: '21',
    CYEAR2: '2026',
    NRUNNO: 1,
};
const row = (overrides = {}) => ({
    DWG: 'YA154D379',
    GNO: '-01',
    LNO: '',
    ITEM: '125',
    PROCID_OLD: 'G1SHE',
    PROCID: 'G1SHE',
    ...overrides,
});
const form = (ITEMS = [row()]) => ({
    NFRMNO: 4,
    VORGNO: '051401',
    CYEAR: '21',
    REQUEST_BY: '25009',
    INPUT_BY: '25009',
    ITEMS,
});

describe('PTS forms by ITEM', () => {
    it('splits different ITEMs and merges matching identities across batches', () => {
        const result = groupTsForms([
            form([row(), row({ ITEM: '127', DWG: 'YA188D858' })]),
            form([row({ PROCID_OLD: 'G1PR4' })]),
        ]);
        expect(result).toHaveLength(2);
        expect(
            result.map((group) => group.ITEMS.map((item) => item.ITEM)),
        ).toEqual([['125', '125'], ['127']]);
    });
    function setup() {
        let runno = 0;
        const repo: any = {
            transaction: jest.fn((work) => work()),
            lockFormNumber: jest.fn(),
            processExists: jest.fn().mockResolvedValue(false),
            requireForm: jest.fn(),
            exists: jest.fn().mockResolvedValue(false),
            insert: jest.fn(),
            updateItemFlow: jest.fn(),
        };
        const forms: any = {
            create: jest.fn(async () => ({
                status: true,
                data: { ...key, NRUNNO: ++runno },
            })),
        };
        return { repo, forms, service: new IePtsService(repo, forms) };
    }
    it('creates the requested 3+1 process example as two forms, then updates each flow', async () => {
        const { repo, forms, service } = setup();
        const result = await service.autoInsert(
            [
                form([
                    row(),
                    row({ PROCID_OLD: 'G1PR4', PROCID: 'G1PR4' }),
                    row({
                        DWG: 'YA188D858',
                        PROCID_OLD: 'G1LZ3',
                        PROCID: 'G1LZ3',
                    }),
                    row({
                        GNO: '-02',
                        ITEM: '127',
                        PROCID_OLD: 'G1LZ3',
                        PROCID: 'G1LZ3',
                    }),
                ]),
            ],
            'ip',
        );
        expect(result.created).toBe(2);
        expect(forms.create).toHaveBeenCalledTimes(2);
        expect(
            repo.insert.mock.calls.map(([data]) => [
                data.NRUNNO,
                data.DETAILS.length,
                data.HEADERS.map((head) => head.ITEMNO),
            ]),
        ).toEqual([
            [1, 3, ['125', '125']],
            [2, 1, ['127']],
        ]);
        expect(repo.updateItemFlow).toHaveBeenNthCalledWith(
            1,
            { ...key, NRUNNO: 1 },
            '125',
        );
        expect(repo.updateItemFlow).toHaveBeenNthCalledWith(
            2,
            { ...key, NRUNNO: 2 },
            '127',
        );
        expect(repo.insert.mock.invocationCallOrder[0]).toBeLessThan(
            repo.updateItemFlow.mock.invocationCallOrder[0],
        );
        expect(result.items.map((item) => (item.form as any).ITEM)).toEqual([
            '125',
            '127',
        ]);
    });
    it('does not reassign approval when the entire item group is skipped', async () => {
        const { repo, service } = setup();
        repo.processExists.mockResolvedValue(true);
        expect((await service.autoInsert([form()], 'ip')).created).toBe(0);
        expect(repo.updateItemFlow).not.toHaveBeenCalled();
    });
    it('propagates flow update errors out of the batch transaction', async () => {
        const { repo, service } = setup();
        repo.updateItemFlow.mockRejectedValue(new Error('flow update failed'));
        await expect(service.autoInsert([form()], 'ip')).rejects.toThrow(
            'flow update failed',
        );
    });
});

describe('PTS item approval assignment', () => {
    function setup(
        pic: unknown[] = [{ SEMPNO: '11111', SEMPNO2: '22222' }],
        heads: unknown[] = [{ HEADNO: '33333' }],
    ) {
        const update = jest.fn().mockResolvedValue({ affected: 1 });
        const manager: any = {
            query: jest
                .fn()
                .mockResolvedValueOnce(pic)
                .mockResolvedValueOnce(heads),
            getRepository: jest.fn((entity) => {
                expect(entity).toBe(FLOW);
                return { update };
            }),
        };
        const ds: any = { manager, transaction: async (work) => work(manager) };
        manager.connection = ds;
        const repo = new IePtsRepository(ds);
        return { repo, manager, update };
    }
    it('sets step20 from SEMPNO/SEMPNO2 and step10 from HEADNO using all five keys', async () => {
        const { repo, manager, update } = setup();
        await repo.transaction(() => (repo as any).updateItemFlow(key, '125'));
        expect(manager.query.mock.calls[0][0]).toContain(
            'WEBFORM.DWGNOTICEPICMST',
        );
        expect(manager.query.mock.calls[0][1]).toEqual(['125']);
        expect(manager.query.mock.calls[1][0]).toContain('WEBFORM.SEQUENCEORG');
        expect(manager.query.mock.calls[1][1]).toEqual(['11111']);
        expect(update).toHaveBeenNthCalledWith(
            1,
            { ...key, CSTEPNO: '20' },
            { VAPVNO: '11111', VREPNO: '22222' },
        );
        expect(update).toHaveBeenNthCalledWith(
            2,
            { ...key, CSTEPNO: '10' },
            { VAPVNO: '33333', VREPNO: '33333' },
        );
        expect(transactionContext.getStore()).toBeUndefined();
    });
    it.each([null, '', '   '])(
        'uses SEMPNO if SEMPNO2 is blank: %j',
        async (SEMPNO2) => {
            const { repo, update } = setup([{ SEMPNO: ' 11111 ', SEMPNO2 }]);
            await repo.transaction(() =>
                (repo as any).updateItemFlow(key, '125'),
            );
            expect(update.mock.calls[0][1]).toEqual({
                VAPVNO: '11111',
                VREPNO: '11111',
            });
        },
    );
    it('keeps both master approvers when PIC is missing', async () => {
        const { repo, update } = setup([]);
        await repo.transaction(() => (repo as any).updateItemFlow(key, '125'));
        expect(update).not.toHaveBeenCalled();
    });
    it('keeps master step10 when HEADNO is missing', async () => {
        const { repo, update } = setup(undefined, []);
        await repo.transaction(() => (repo as any).updateItemFlow(key, '125'));
        expect(update).toHaveBeenCalledTimes(1);
        expect(update.mock.calls[0][0].CSTEPNO).toBe('20');
    });
});
