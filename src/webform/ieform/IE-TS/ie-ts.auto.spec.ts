import { IeTsService } from './ie-ts.service';

const key = {
    NFRMNO: 31,
    VORGNO: '051401',
    CYEAR: '26',
    CYEAR2: '2026',
    NRUNNO: 42,
};
const row = (values = {}) => ({
    DWG: 'DWG000001',
    GNO: '001',
    LNO: '001',
    ITEM: '001',
    PROCID_OLD: 'OLD001',
    PROCID: 'NEW001',
    ...values,
});
const auto = (values = {}) => ({
    NFRMNO: 31,
    VORGNO: '051401',
    CYEAR: '26',
    REQUEST_BY: '12345',
    INPUT_BY: '23456',
    ITEMS: [row()],
    ...values,
});

describe('Automatic TS batch creation', () => {
    let repo: any;
    let forms: any;
    let service: IeTsService;
    beforeEach(() => {
        repo = {
            transaction: jest.fn((work) => work()),
            lockFormNumber: jest.fn(),
            lockTsProcesses: jest.fn(),
            processExists: jest.fn().mockResolvedValue(false),
            requireForm: jest.fn(),
            exists: jest.fn().mockResolvedValue(false),
            insert: jest.fn(),
        };
        forms = {
            create: jest.fn().mockResolvedValue({ status: true, data: key }),
        };
        service = new IeTsService(repo, forms);
    });
    it('creates Form/Flow before inserting header/detail with generated keys and sequences', async () => {
        const result = await service.autoInsert([auto()], '127.0.0.1');
        expect(forms.create).toHaveBeenCalledWith(
            {
                NFRMNO: 31,
                VORGNO: '051401',
                CYEAR: '26',
                REQBY: '12345',
                INPUTBY: '23456',
            },
            '127.0.0.1',
        );
        expect(repo.lockTsProcesses.mock.invocationCallOrder[0]).toBeLessThan(
            repo.processExists.mock.invocationCallOrder[0],
        );
        expect(repo.processExists.mock.invocationCallOrder[0]).toBeLessThan(
            forms.create.mock.invocationCallOrder[0],
        );
        expect(forms.create.mock.invocationCallOrder[0]).toBeLessThan(
            repo.insert.mock.invocationCallOrder[0],
        );
        expect(repo.insert.mock.calls[0][0]).toEqual({
            ...key,
            HEADERS: [
                {
                    SEQ: '001',
                    DWGNO: 'DWG000001',
                    GNO: '001',
                    LNO: '001',
                    ITEMNO: '001',
                },
            ],
            DETAILS: [
                {
                    DWG: 'DWG000001',
                    GNO: '001',
                    LNO: '001',
                    PROCID_OLD: 'OLD001',
                    PROCID: 'NEW001',
                    SEQ: '001',
                    SEQ_PROC: '01',
                },
            ],
        });
        expect(repo.insert.mock.calls[0][0]).not.toHaveProperty('FILES');
        expect(result.items[0].key).toEqual(key);
        expect(result.created).toBe(1);
        expect(repo.transaction).toHaveBeenCalledTimes(1);
    });
    it('does not insert any of the four tables when all items already exist', async () => {
        repo.processExists.mockResolvedValue(true);
        const result = await service.autoInsert([auto()], 'ip');
        expect(result).toMatchObject({
            created: 0,
            skipped: 1,
            items: [{ status: 'skipped', inserted: 0, skipped: 1, key: null }],
        });
        expect(forms.create).not.toHaveBeenCalled();
        expect(repo.insert).not.toHaveBeenCalled();
    });
    it('filters duplicate input and assigns contiguous sequences after filtering', async () => {
        repo.processExists.mockImplementation(
            async (item) => item.PROCID_OLD === 'OLD001',
        );
        const result = await service.autoInsert(
            [
                auto({
                    ITEMS: [
                        row(),
                        row({ PROCID_OLD: 'OLD002', PROCID: 'NEW002' }),
                        row({ PROCID_OLD: 'OLD002', PROCID: 'NEW002' }),
                        row({ DWG: 'DWG000002', PROCID_OLD: 'OLD003' }),
                    ],
                }),
            ],
            'ip',
        );
        const inserted = repo.insert.mock.calls[0][0];
        expect(inserted.HEADERS.map((head) => head.SEQ)).toEqual([
            '001',
            '002',
        ]);
        expect(
            inserted.DETAILS.map((detail) => [
                detail.PROCID_OLD,
                detail.SEQ,
                detail.SEQ_PROC,
            ]),
        ).toEqual([
            ['OLD002', '001', '01'],
            ['OLD003', '002', '01'],
        ]);
        expect(result.items[0]).toMatchObject({
            received: 4,
            inserted: 2,
            skipped: 2,
        });
    });
    it('merges matching form identities but allocates separate numbers for other identities', async () => {
        forms.create
            .mockResolvedValueOnce({ status: true, data: key })
            .mockResolvedValueOnce({
                status: true,
                data: { ...key, NRUNNO: 43 },
            });
        const result = await service.autoInsert(
            [
                auto(),
                auto({
                    ITEMS: [row({ PROCID_OLD: 'OLD002', PROCID: 'NEW002' })],
                }),
                auto({
                    REQUEST_BY: '99999',
                    ITEMS: [row({ DWG: 'DWG000002' })],
                }),
            ],
            'ip',
        );
        expect(result.created).toBe(2);
        expect(forms.create).toHaveBeenCalledTimes(2);
        expect(repo.insert.mock.calls[0][0].DETAILS).toHaveLength(2);
        expect(repo.insert.mock.calls[1][0].NRUNNO).toBe(43);
    });
    it('deduplicates across groups in the same batch', async () => {
        const result = await service.autoInsert(
            [
                auto(),
                auto({
                    REQUEST_BY: '99999',
                    ITEMS: [row({ ITEM: '999', PROCID: 'OTHER' })],
                }),
            ],
            'ip',
        );
        expect(result).toMatchObject({ created: 1, skipped: 1 });
        expect(forms.create).toHaveBeenCalledTimes(1);
    });
    it('rejects an empty batch without opening a transaction', async () => {
        await expect(service.autoInsert([], 'ip')).rejects.toThrow(
            'At least one',
        );
        expect(repo.transaction).not.toHaveBeenCalled();
    });
    it('propagates later insertion failures out of the batch transaction', async () => {
        repo.insert
            .mockResolvedValueOnce(undefined)
            .mockRejectedValueOnce(new Error('database failure'));
        await expect(
            service.autoInsert(
                [
                    auto(),
                    auto({
                        REQUEST_BY: '99999',
                        ITEMS: [row({ DWG: 'DWG000002' })],
                    }),
                ],
                'ip',
            ),
        ).rejects.toThrow('database failure');
    });
    it('rejects incomplete generated keys and conflicting new PROCID before TS writes', async () => {
        forms.create.mockResolvedValue({
            status: true,
            data: { ...key, NRUNNO: undefined },
        });
        await expect(service.autoInsert([auto()], 'ip')).rejects.toThrow(
            'form key',
        );
        expect(repo.insert).not.toHaveBeenCalled();
        forms.create.mockClear();
        await expect(
            service.autoInsert(
                [auto({ ITEMS: [row(), row({ PROCID_OLD: 'OLD002' })] })],
                'ip',
            ),
        ).rejects.toThrow('PROCID');
        expect(forms.create).not.toHaveBeenCalled();
    });
});
