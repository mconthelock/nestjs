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
        });
        await validate(dto, { whitelist: true });
        expect(dto).toEqual({ QTY: '10' });
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
    const { CYEAR2, NRUNNO, ...input } = key;
    const dto = { ...input, REQBY: '10001', INPUTBY: '10002', QTY: '10' };
    function setup() {
        const manager = { query: jest.fn().mockResolvedValue(undefined) };
        const ds = { transaction: jest.fn(async (fn) => fn(manager)) };
        const forms = { create: jest.fn().mockResolvedValue({ status: true, data: { ...key, NRUNNO: 42 } }) };
        const adjust = { insert_adjust: jest.fn(async () => {
            expect(transactionContext.getStore()?.manager).toBe(manager);
            return { status: true };
        }) };
        return { manager, ds, forms, adjust, service: new PsAdjAutoService(ds as any, forms as any, adjust as any) };
    }
    it('requires requester and inputter but not generated keys', async () => {
        expect(await validate(plainToInstance(AutoInsertAdjustDto, dto))).toHaveLength(0);
        const errors = await validate(plainToInstance(AutoInsertAdjustDto, input));
        expect(errors.map(e => e.property).sort()).toEqual(['INPUTBY', 'REQBY']);
    });
    it('uses generated keys and strips form-only fields before insert', async () => {
        const { service, forms, adjust, manager } = setup();
        const result = await service.auto_insert_adjust(dto, '127.0.0.1');
        expect(manager.query).toHaveBeenCalledWith('LOCK TABLE WEBFORM.FORM IN SHARE ROW EXCLUSIVE MODE');
        expect(forms.create).toHaveBeenCalledWith({ NFRMNO: 1, VORGNO: '050301', CYEAR: '26', REQBY: '10001', INPUTBY: '10002' }, '127.0.0.1');
        expect(adjust.insert_adjust).toHaveBeenCalledWith({ ...key, NRUNNO: 42, QTY: '10' });
        expect(result.data).toEqual({ ...key, NRUNNO: 42 });
    });
    it('does not insert adjust if form creation fails or returns an incomplete key', async () => {
        const { service, forms, adjust } = setup();
        forms.create.mockResolvedValue({ status: true, data: { CYEAR2: '2026' } } as any);
        await expect(service.auto_insert_adjust(dto, '127.0.0.1')).rejects.toThrow('incomplete form key');
        expect(adjust.insert_adjust).not.toHaveBeenCalled();
    });
    it('propagates insert failures out of the transaction for rollback', async () => {
        const { service, ds, adjust } = setup();
        adjust.insert_adjust.mockRejectedValue(new Error('insert failed') as never);
        await expect(service.auto_insert_adjust(dto, '127.0.0.1')).rejects.toThrow('insert failed');
        expect(ds.transaction).toHaveBeenCalledTimes(1);
    });
});
