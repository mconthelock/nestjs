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
