import { UniformService } from './uniform.service';

describe('UniformService', () => {
    describe('createAnnualRequest', () => {
        it('should pass DETAILS as an array to the repository', async () => {
            const repo = {
                create: jest.fn().mockResolvedValue({ ok: true }),
            };

            const service = new UniformService(
                {} as any,
                {} as any,
                {} as any,
                repo as any,
            );

            const payload = {
                REQ_YEAR: 2026,
                REQ_USER: 'USER01',
                CREATE_DATE: new Date('2026-01-01T00:00:00.000Z'),
                CREATE_BY: 'SYSTEM',
                CSTATUS: '1',
                REMARK: 'test',
                DETAILS: [{ PRODUCT: 1001, REQUEST_QTY: 2, REMARK: 'ok' }],
            };

            await service.createAnnualRequest(payload as any);

            expect(repo.create).toHaveBeenCalledTimes(1);
            expect(repo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    REQ_YEAR: 2026,
                    REQ_USER: 'USER01',
                    CSTATUS: '1',
                }),
                payload.DETAILS,
            );
        });
    });
});
