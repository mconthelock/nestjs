import { GpTphRepository } from './gp-tph.repository';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

describe('GP-TPH consecutive approvals', () => {
    it('never auto-approves an Area Owner step before areas are selected', async () => {
        const query = jest.fn();
        const findBy = jest.fn().mockResolvedValue([
            { CEXTDATA: '01', CSTEPNO: '02', CAPVSTNO: '0',
                CSTEPST: '2', VAPVNO: 'EMP', VREPNO: 'EMP' },
        ]);
        const repo: GpTphRepository = Object.assign(Object.create(GpTphRepository.prototype), {
            dataSource: { manager: { getRepository: () => ({ findBy }), query } },
        });
        await repo.approveGpTphConsecutiveSteps(
            { NFRMNO: 1, VORGNO: 'ORG', CYEAR: '26', CYEAR2: '2026', NRUNNO: 1 },
            Object.assign(new FLOW(), { CSTEPNO: '01', CSTEPNEXTNO: '02' }),
            { VREALAPV: 'EMP' },
        );
        expect(findBy).toHaveBeenCalledTimes(1);
        expect(query).not.toHaveBeenCalled();
    });
});
