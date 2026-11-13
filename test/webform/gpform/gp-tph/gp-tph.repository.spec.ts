import { GpTphRepository } from 'src/webform/gpform/gp-tph/gp-tph.repository';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

const form = { NFRMNO: 1, VORGNO: 'ORG', CYEAR: '26', CYEAR2: '2026', NRUNNO: 1 };
const params = {
    DAPVDATE: '2026-11-13', CAPVTIME: '14:59:41',
    VREMARK: '', VREMOTE: '127.0.0.1', VREALAPV: 'EMP',
};

describe('GP-TPH consecutive approvals', () => {
    it('never auto-approves an Area Owner step before areas are selected', async () => {
        const query = jest.fn();
        const findBy = jest.fn().mockResolvedValue([
            {
                CEXTDATA: '01',
                CSTEPNO: '02',
                CAPVSTNO: '0',
                CSTEPST: '2',
                VAPVNO: 'EMP',
                VREPNO: 'EMP',
            },
        ]);
        const repo: GpTphRepository = Object.assign(Object.create(GpTphRepository.prototype), {
            dataSource: { manager: { getRepository: () => ({ findBy }), query } },
        });
        await repo.approveGpTphConsecutiveSteps(
            form,
            Object.assign(new FLOW(), { CSTEPNO: '01', CSTEPNEXTNO: '02' }),
            params,
        );
        expect(findBy).toHaveBeenCalledTimes(1);
        expect(query).not.toHaveBeenCalled();
    });

    it('does not reuse an Area Owner approval for any following step', async () => {
        const findBy = jest.fn();
        const query = jest.fn();
        const repo: GpTphRepository = Object.assign(Object.create(GpTphRepository.prototype), {
            dataSource: { manager: { getRepository: () => ({ findBy }), query } },
        });
        await repo.approveGpTphConsecutiveSteps(
            form,
            Object.assign(new FLOW(), { CSTEPNO: '01', CSTEPNEXTNO: '02', CEXTDATA: '01' }),
            params,
        );
        expect(findBy).not.toHaveBeenCalled();
        expect(query).not.toHaveBeenCalled();
    });

    it('does not approve later steps while another current co-approver is pending', async () => {
        const findBy = jest.fn().mockResolvedValue([
            { VAPVNO: 'OWNER', VREPNO: 'EMP', CAPVSTNO: '0' },
            { VAPVNO: 'OTHER', VREPNO: 'OTHER', CAPVSTNO: '0' },
        ]);
        const query = jest.fn();
        const repo: GpTphRepository = Object.assign(Object.create(GpTphRepository.prototype), {
            dataSource: { manager: { getRepository: () => ({ findBy }), query } },
        });
        await repo.approveGpTphConsecutiveSteps(
            form,
            Object.assign(new FLOW(), { CSTEPNO: '01', CSTEPNEXTNO: '02', CAPVTYPE: '3' }),
            params,
        );
        expect(findBy).toHaveBeenCalledTimes(1);
        expect(query).not.toHaveBeenCalled();
    });

    it('allows the same representative to proceed when all current co-approvers are covered', async () => {
        const findBy = jest.fn().mockImplementation(async ({ CSTEPNO }) => {
            if (CSTEPNO === '01') return [
                { VAPVNO: 'OWNER1', VREPNO: 'EMP', CAPVSTNO: '0' },
                { VAPVNO: 'OWNER2', VREPNO: 'EMP', CAPVSTNO: '0' },
            ];
            return [{ CSTEPNO: '02', CSTEPNEXTNO: '00', CAPVSTNO: '0',
                CSTEPST: '2', VAPVNO: 'EMP', VREPNO: 'EMP' }];
        });
        const query = jest.fn();
        const repo: GpTphRepository = Object.assign(Object.create(GpTphRepository.prototype), {
            dataSource: { manager: { getRepository: () => ({ findBy }), query } },
        });
        await repo.approveGpTphConsecutiveSteps(
            form,
            Object.assign(new FLOW(), { CSTEPNO: '01', CSTEPNEXTNO: '02', CAPVTYPE: '3' }),
            params,
        );
        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][1][12]).toBe('02');
    });

    it('reuses consecutive approvals only until a future co-approver is pending', async () => {
        const findBy = jest.fn().mockImplementation(async ({ CSTEPNO }) => {
            if (CSTEPNO === '02') return [
                { CSTEPNO: '02', CSTEPNEXTNO: '03', CAPVSTNO: '0', CSTEPST: '2', VAPVNO: 'EMP', VREPNO: 'EMP' },
                { CSTEPNO: '02', CSTEPNEXTNO: '03', CAPVSTNO: '0', CSTEPST: '2', VAPVNO: 'OTHER', VREPNO: 'OTHER' },
            ];
            throw new Error(`Unexpected step ${CSTEPNO}`);
        });
        const query = jest.fn();
        const repo: GpTphRepository = Object.assign(Object.create(GpTphRepository.prototype), {
            dataSource: { manager: { getRepository: () => ({ findBy }), query } },
        });
        await repo.approveGpTphConsecutiveSteps(
            form,
            Object.assign(new FLOW(), { CSTEPNO: '01', CSTEPNEXTNO: '02', CAPVTYPE: '1' }),
            params,
        );
        expect(query).toHaveBeenCalledTimes(1);
        expect(query.mock.calls[0][1][12]).toBe('02');
        expect(findBy).toHaveBeenCalledTimes(1);
    });

    it('keeps reusing consecutive approvals for the same representative before an Area Owner', async () => {
        const findBy = jest.fn().mockImplementation(async ({ CSTEPNO }) => ({
            '02': [{ CSTEPNO: '02', CSTEPNEXTNO: '03', CAPVSTNO: '0', CSTEPST: '2', VAPVNO: 'OTHER', VREPNO: 'EMP' }],
            '03': [{ CSTEPNO: '03', CSTEPNEXTNO: '04', CAPVSTNO: '0', CSTEPST: '1', VAPVNO: 'EMP', VREPNO: 'EMP' }],
            '04': [{ CSTEPNO: '04', CSTEPNEXTNO: '05', CEXTDATA: '01', CAPVSTNO: '0', CSTEPST: '1', VAPVNO: 'EMP', VREPNO: 'EMP' }],
        }[CSTEPNO]));
        const query = jest.fn();
        const repo: GpTphRepository = Object.assign(Object.create(GpTphRepository.prototype), {
            dataSource: { manager: { getRepository: () => ({ findBy }), query } },
        });
        await repo.approveGpTphConsecutiveSteps(
            form,
            Object.assign(new FLOW(), { CSTEPNO: '01', CSTEPNEXTNO: '02', CAPVTYPE: '1' }),
            params,
        );
        expect(query.mock.calls.map((call) => call[1][12])).toEqual(['02', '03']);
        expect(findBy).toHaveBeenCalledTimes(3);
    });
});
