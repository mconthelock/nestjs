import { FlowRepository } from './flow.repository';

describe('FlowRepository.getFlowTree', () => {
    it('includes the workflow type used to identify requester-supervisor steps', () => {
        const query = jest.fn();
        const repo: FlowRepository = Object.assign(Object.create(FlowRepository.prototype), {
            dataSource: { manager: { getRepository: () => ({ query }) } },
        });
        const form = { NFRMNO: 1, VORGNO: 'ORG', CYEAR: '26', CYEAR2: '2026', NRUNNO: 1 };
        repo.getFlowTree(form);
        expect(query.mock.calls[0][0]).toContain('F.CTYPE');
        expect(query.mock.calls[0][1]).toEqual([1, 'ORG', '26', '2026', 1]);
    });
});

describe('FlowRepository.doactionUpdateFlow', () => {
    function createRepository() {
        const query = jest.fn();
        const repo: FlowRepository = Object.assign(Object.create(FlowRepository.prototype), {
            dataSource: { manager: { query } },
            APV_TYPE_SINGLE: '1', APV_TYPE_MULTIPLE_CO: '3',
            APPLY_ALL_NONE: '0', APPLY_ALL_APV: '1', APPLY_ALL_REJ: '2', APPLY_ALL_BOTH: '3',
        });
        return { repo, query };
    }

    it.each(['1', '3'])('excludes other protected steps for approver type %s', async (type) => {
        const { repo, query } = createRepository();
        await repo.doactionUpdateFlow(
            { CSTEPNO: '02', CAPVTYPE: type, CAPPLYALL: '1' },
            { VREALAPV: '07059' },
            '01',
        );
        const [sql, params] = query.mock.calls[0];
        expect(sql).toContain("(CSTEPNO = :stepNo or NVL(TRIM(CEXTDATA), ' ') <> :excludedStepTag)");
        expect(params).toMatchObject({ stepNo: '02', excludedStepTag: '01' });
        expect(sql).toContain('VAPVNO = :apv1 or VREPNO = :rep1');
    });

    it('does not change apply-all behavior when no protection is requested', async () => {
        const { repo, query } = createRepository();
        await repo.doactionUpdateFlow(
            { CSTEPNO: '02', CAPVTYPE: '1', CAPPLYALL: '1' },
            { VREALAPV: '07059' },
        );
        const [sql, params] = query.mock.calls[0];
        expect(sql).toContain('(CSTEPNO = :stepNo or (VAPVNO = :apv1 or VREPNO = :rep1))');
        expect(sql).not.toContain(':excludedStepTag');
        expect(params).not.toHaveProperty('excludedStepTag');
    });
});
