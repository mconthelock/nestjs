import { FormmstService } from './formmst.service';

describe('FormmstService.updateFormMaster', () => {
    it('should strip invalid NaN values before updating the record', async () => {
        const repo = {
            getFormmst: jest.fn().mockResolvedValue([
                {
                    NNO: 1,
                    VORGNO: 'ORG1',
                    CYEAR: '25',
                },
            ]),
            updateFormMaster: jest.fn().mockResolvedValue({ affected: 1 }),
        } as any;

        const service = new FormmstService(repo);

        await service.updateFormMaster({
            NNO: 1,
            VORGNO: 'ORG1',
            CYEAR: '25',
            VNAME: 'Test form',
            VANAME: 'TEST',
            VDESC: 'desc',
            VFORMPAGE: 'page',
            NRUNNO: Number.NaN,
            NLIFETIME: Number.NaN,
        } as any);

        expect(repo.updateFormMaster).toHaveBeenCalledWith(
            expect.objectContaining({
                VNAME: 'Test form',
                VANAME: 'TEST',
                VDESC: 'desc',
                VFORMPAGE: 'page',
            }),
            {
                NNO: 1,
                VORGNO: 'ORG1',
                CYEAR: '25',
            },
        );

        const payload = repo.updateFormMaster.mock.calls[0][0];
        expect(payload).not.toHaveProperty('NRUNNO');
        expect(payload).not.toHaveProperty('NLIFETIME');
        expect(Object.keys(payload)).not.toContain('NaN');
    });
});
