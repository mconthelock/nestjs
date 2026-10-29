import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
    AutoInsertTsProcessDto,
    InsertTsProcessDto,
} from './dto/ts-process.dto';
import { IeTsService } from './ie-ts.service';

const key = {
    NFRMNO: 31,
    VORGNO: '051401',
    CYEAR: '26',
    CYEAR2: '2026',
    NRUNNO: 42,
};
const payload = () => ({
    ...key,
    HEADERS: [{ SEQ: '001', INPUTDATE: '2026-10-29' }],
    DETAILS: [{ SEQ: '001', PROCID: 'P001', PROCID_OLD: 'P000' }],
    FILES: [{ ID: 1, FILENAME: 'drawing.pdf' }],
});
const check = (cls: any, data: unknown) =>
    validate(plainToInstance(cls, data), {
        whitelist: true,
        forbidNonWhitelisted: true,
    });

describe('TS request validation', () => {
    it('accepts normal payload and rejects missing/oversized nested fields', async () => {
        expect(await check(InsertTsProcessDto, payload())).toHaveLength(0);
        expect(
            await check(InsertTsProcessDto, {
                ...payload(),
                DETAILS: [{ SEQ: '001', PROCID: '1234567' }],
            }),
        ).not.toHaveLength(0);
        expect(
            await check(InsertTsProcessDto, { ...payload(), HEADERS: [] }),
        ).not.toHaveLength(0);
        expect(
            await check(InsertTsProcessDto, { ...payload(), NRUNNO: null }),
        ).not.toHaveLength(0);
    });
    it('validates flat auto items and new requester field names', async () => {
        const data = {
            NFRMNO: 31,
            VORGNO: '051401',
            CYEAR: '26',
            REQUEST_BY: '12345',
            INPUT_BY: '23456',
            ITEMS: [
                {
                    DWG: 'DWG000001',
                    GNO: '001',
                    LNO: '001',
                    ITEM: '001',
                    PROCID_OLD: 'OLD001',
                    PROCID: 'NEW001',
                },
            ],
        };
        expect(await check(AutoInsertTsProcessDto, data)).toHaveLength(0);
        for (const extra of [
            { NRUNNO: 1 },
            { CYEAR2: '2026' },
            { REQUEST_BY: null },
            { ITEMS: [] },
            { ITEMS: [{ ...data.ITEMS[0], LNO: '1234' }] },
            { FILES: [] },
            { REQBY: '12345' },
        ]) {
            expect(
                await check(AutoInsertTsProcessDto, { ...data, ...extra }),
            ).not.toHaveLength(0);
        }
    });
    it('enforces attachment form precision and file IDs', async () => {
        expect(
            await check(InsertTsProcessDto, { ...payload(), NFRMNO: 1000 }),
        ).not.toHaveLength(0);
        expect(
            await check(InsertTsProcessDto, {
                ...payload(),
                FILES: [{ ID: 100 }],
            }),
        ).not.toHaveLength(0);
        expect(
            await check(InsertTsProcessDto, {
                ...payload(),
                NFRMNO: 1000,
                FILES: [],
            }),
        ).toHaveLength(0);
    });
    it.each(['2026-02-31', 'not a date', 123])(
        'rejects invalid INPUTDATE %j',
        async (INPUTDATE) => {
            expect(
                await check(InsertTsProcessDto, {
                    ...payload(),
                    HEADERS: [{ SEQ: '001', INPUTDATE }],
                }),
            ).not.toHaveLength(0);
        },
    );
});

describe('TS orchestration', () => {
    let repo: any;
    let forms: any;
    let service: IeTsService;
    beforeEach(() => {
        repo = {
            transaction: jest.fn((work) => work()),
            lockFormNumber: jest.fn(),
            requireForm: jest.fn(),
            exists: jest.fn().mockResolvedValue(false),
            insert: jest.fn(),
            read: jest.fn().mockResolvedValue(payload()),
            replace: jest.fn(),
            remove: jest.fn(),
        };
        forms = {
            create: jest.fn().mockResolvedValue({ status: true, data: key }),
        };
        service = new IeTsService(repo, forms);
    });
    it.each([
        { HEADERS: [{ SEQ: '001' }, { SEQ: '001' }] },
        {
            DETAILS: [
                { SEQ: '001', PROCID: 'P1', PROCID_OLD: 'P0' },
                { SEQ: '001', PROCID: 'P1', PROCID_OLD: 'P0' },
            ],
        },
        { FILES: [{ ID: 1 }, { ID: 1 }] },
    ])('rejects duplicate composite keys before writes: %j', async (data) => {
        await expect(
            service.insert({ ...payload(), ...data } as any),
        ).rejects.toThrow('Duplicate');
        expect(repo.insert).not.toHaveBeenCalled();
    });
    it('rejects duplicate form insertion rather than overwriting rows', async () => {
        repo.exists.mockResolvedValue(true);
        await expect(
            service.insert(plainToInstance(InsertTsProcessDto, payload())),
        ).rejects.toThrow('already exists');
        expect(repo.insert).not.toHaveBeenCalled();
    });
    it('returns 404 for missing TS data and does not replace or delete', async () => {
        await expect(
            service.update(plainToInstance(InsertTsProcessDto, payload())),
        ).rejects.toThrow('not found');
        await expect(service.remove(key)).rejects.toThrow('not found');
        expect(repo.replace).not.toHaveBeenCalled();
        expect(repo.remove).not.toHaveBeenCalled();
    });
});
