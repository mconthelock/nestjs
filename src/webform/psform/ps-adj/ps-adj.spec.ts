import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateOrderDto, OrderKeyDto, UpdateOrderDto } from './dto/ps-adj.dto';
import { PsAdjService } from './ps-adj.service';

const key = {
    NFRMNO: 1,
    VORGNO: '050301',
    CYEAR: '26',
    CYEAR2: '2026',
    NRUNNO: 1,
    CNTLNO: '00000000001',
};
describe('PsAdj validation and safe mutations', () => {
    it('accepts a valid insert and rejects missing composite keys', async () => {
        expect(
            await validate(plainToInstance(CreateOrderDto, key)),
        ).toHaveLength(0);
        expect(
            (await validate(plainToInstance(OrderKeyDto, { NFRMNO: 1 })))
                .length,
        ).toBeGreaterThan(0);
    });
    it('rejects oversized strings and fractional NUMBER columns', async () => {
        expect(
            (
                await validate(
                    plainToInstance(CreateOrderDto, {
                        ...key,
                        ORDERNO: '1234567890',
                        PRNO: 1.5,
                    }),
                )
            ).length,
        ).toBe(2);
    });
    it('keeps primary keys out of updates', async () => {
        const dto = plainToInstance(UpdateOrderDto, {
            CNTLNO: 'other',
            QTY: '10',
            DWGNO: 'DWG001',
        });
        await validate(dto, { whitelist: true });
        expect(dto).toEqual({ QTY: '10', DWGNO: 'DWG001' });
    });
    it('returns 404 when updating a missing row', async () => {
        const repo = {
            updateOrder: jest.fn().mockResolvedValue({ affected: 0 }),
        };
        const service = new PsAdjService(repo as any);
        await expect(
            service.updateOrder(key, { QTY: '10' }),
        ).rejects.toMatchObject({ status: 404 });
    });
    it('rejects empty updates before calling the repository', async () => {
        const repo = { updateOrder: jest.fn() };
        await expect(
            new PsAdjService(repo as any).updateOrder(key, {}),
        ).rejects.toMatchObject({ status: 400 });
        expect(repo.updateOrder).not.toHaveBeenCalled();
    });
});

import { AutoInsertAdjustDto } from './dto/auto-insert-adjust.dto';
import { PsAdjAutoService } from './ps-adj-auto.service';
import { transactionContext } from 'src/common/interceptors/transaction-context';

describe('auto_insert_adjust', () => {
    const { CYEAR2, NRUNNO, ...originalInput } = key;
    const input = { ...originalInput, DWGNO: 'DWG001' };
    const dto = {
        ...input,
        REQBY: '10001',
        INPUTBY: '10002',
        DWGNO: 'DWG001',
        QTY: '10',
    };
    function setup() {
        const manager = { query: jest.fn().mockResolvedValue(undefined) };
        const ds = { transaction: jest.fn(async (fn) => fn(manager)) };
        const forms = {
            create: jest.fn().mockResolvedValue({
                status: true,
                data: { ...key, NRUNNO: 42 },
            }),
        };
        const adjust = {
            insert_adjust: jest.fn(async () => {
                expect(transactionContext.getStore()?.manager).toBe(manager);
                return { status: true };
            }),
        };
        return {
            manager,
            ds,
            forms,
            adjust,
            service: new PsAdjAutoService(
                ds as any,
                forms as any,
                adjust as any,
                { existsByDrawing: jest.fn().mockResolvedValue(false) } as any,
            ),
        };
    }
    it('requires requester and inputter but not generated keys', async () => {
        expect(
            await validate(plainToInstance(AutoInsertAdjustDto, dto)),
        ).toHaveLength(0);
        const errors = await validate(
            plainToInstance(AutoInsertAdjustDto, input),
        );
        expect(errors.map((e) => e.property).sort()).toEqual([
            'INPUTBY',
            'REQBY',
        ]);
    });
    it('uses generated keys and strips form-only fields before insert', async () => {
        const { service, forms, adjust, manager } = setup();
        const result = await service.auto_insert_adjust(dto, '127.0.0.1');
        expect(manager.query).toHaveBeenCalledWith(
            'LOCK TABLE WEBFORM.FORM IN SHARE ROW EXCLUSIVE MODE',
        );
        expect(forms.create).toHaveBeenCalledWith(
            {
                NFRMNO: 1,
                VORGNO: '050301',
                CYEAR: '26',
                REQBY: '10001',
                INPUTBY: '10002',
            },
            '127.0.0.1',
        );
        expect(adjust.insert_adjust).toHaveBeenCalledWith({
            ...key,
            NRUNNO: 42,
            DWGNO: 'DWG001',
            QTY: '10',
        });
        expect(result.data).toEqual({ ...key, NRUNNO: 42 });
    });
    it('does not insert adjust if form creation fails or returns an incomplete key', async () => {
        const { service, forms, adjust } = setup();
        forms.create.mockResolvedValue({
            status: true,
            data: { CYEAR2: '2026' },
        } as any);
        await expect(
            service.auto_insert_adjust(dto, '127.0.0.1'),
        ).rejects.toThrow('incomplete form key');
        expect(adjust.insert_adjust).not.toHaveBeenCalled();
    });
    it('propagates insert failures out of the transaction for rollback', async () => {
        const { service, ds, adjust } = setup();
        adjust.insert_adjust.mockRejectedValue(
            new Error('insert failed') as never,
        );
        await expect(
            service.auto_insert_adjust(dto, '127.0.0.1'),
        ).rejects.toThrow('insert failed');
        expect(ds.transaction).toHaveBeenCalledTimes(1);
    });
});

// Batch regression coverage: skip existing drawings and continue after item failures.
describe('auto_insert_adjust batches', () => {
    const item = {
        NFRMNO: 1,
        VORGNO: '050301',
        CYEAR: '26',
        CNTLNO: '00000000001',
        REQBY: '10001',
        INPUTBY: '10002',
        DWGNO: 'DWG001',
    };
    function batchSetup() {
        const manager = { query: jest.fn().mockResolvedValue(undefined) };
        const ds = { transaction: jest.fn(async (fn) => fn(manager)) };
        const forms = {
            create: jest.fn().mockResolvedValue({ status: true, data: key }),
        };
        const adjust = {
            insert_adjust: jest.fn().mockResolvedValue({ status: true }),
        };
        const repo = { existsByDrawing: jest.fn().mockResolvedValue(false) };
        const service = new PsAdjAutoService(
            ds as any,
            forms as any,
            adjust as any,
            repo as any,
        );
        return { service, forms, repo, adjust, ds };
    }
    it('skips an existing DWGNO before creating Form/Flow', async () => {
        const { service, forms, repo } = batchSetup();
        repo.existsByDrawing.mockResolvedValue(true);
        const result = await service.auto_insert_adjust([item], '127.0.0.1');
        expect(result).toMatchObject({
            total: 1,
            created: 0,
            skipped: 1,
            failed: 0,
        });
        expect(forms.create).not.toHaveBeenCalled();
    });
    it('continues after a skip and a failed insert', async () => {
        const { service, forms, repo, adjust } = batchSetup();
        repo.existsByDrawing
            .mockResolvedValueOnce(true)
            .mockResolvedValue(false);
        adjust.insert_adjust
            .mockRejectedValueOnce(new Error('insert failed'))
            .mockResolvedValue({ status: true });
        const result = await service.auto_insert_adjust(
            [item, { ...item, DWGNO: 'DWG002' }, { ...item, DWGNO: 'DWG003' }],
            '127.0.0.1',
        );
        expect(result).toMatchObject({
            total: 3,
            created: 1,
            skipped: 1,
            failed: 1,
        });
        expect(result.items.map((i) => i.status)).toEqual([
            'skipped',
            'failed',
            'created',
        ]);
        expect(forms.create).toHaveBeenCalledTimes(2);
    });
    it('skips duplicates within a request after the first insert', async () => {
        const { service, repo, forms } = batchSetup();
        repo.existsByDrawing
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true);
        const result = await service.auto_insert_adjust(
            [item, item],
            '127.0.0.1',
        );
        expect(result).toMatchObject({ created: 1, skipped: 1 });
        expect(forms.create).toHaveBeenCalledTimes(1);
    });
});

import { AutoInsertAdjustPipe } from './dto/auto-insert-adjust.pipe';
describe('auto adjust request validation', () => {
    const item = {
        NFRMNO: 1,
        VORGNO: '050301',
        CYEAR: '26',
        CNTLNO: '00000000001',
        REQBY: '10001',
        INPUTBY: '10002',
        DWGNO: 'DWG001',
    };
    const pipe = new AutoInsertAdjustPipe();
    it('validates object and array bodies and strips generated keys', async () => {
        const single = await pipe.transform({ ...item, NRUNNO: 999 });
        expect(single).toEqual(item);
        expect(await pipe.transform([item, item])).toHaveLength(2);
    });
    it('rejects empty arrays, null items and missing drawings', async () => {
        await expect(pipe.transform([])).rejects.toMatchObject({ status: 400 });
        await expect(pipe.transform([null])).rejects.toMatchObject({
            status: 400,
        });
        await expect(
            pipe.transform([{ ...item, DWGNO: null }]),
        ).rejects.toMatchObject({ status: 400 });
        await expect(
            pipe.transform([{ ...item, DWGNO: '' }]),
        ).rejects.toMatchObject({ status: 400 });
    });
});

import { FormCreateService } from 'src/webform/form/create-form.service';
describe('FormCreateService form master lookup', () => {
    it('reports the missing form master key instead of reading undefined VFORMPAGE', async () => {
        const service = Object.create(FormCreateService.prototype) as any;
        service.formmstService = {
            getFormmst: jest.fn().mockResolvedValue([]),
        };
        await expect(
            service.setFormValue({ nfrmno: 1, vorgno: '050301', cyear: '26' }),
        ).rejects.toThrow('FORMMST not found: NNO=1, VORGNO=050301, CYEAR=26');
    });
    it('uses VFORMPAGE from an existing form master', async () => {
        const service = Object.create(FormCreateService.prototype) as any;
        service.formmstService = {
            getFormmst: jest.fn().mockResolvedValue([{ VFORMPAGE: 'ps-adj' }]),
        };
        const result = await service.setFormValue({
            nfrmno: 1,
            vorgno: '050301',
            cyear: '26',
            cyear2: '2026',
            nrunno: 42,
        });
        expect(result.VFORMPAGE).toBe('ps-adj');
    });
});
