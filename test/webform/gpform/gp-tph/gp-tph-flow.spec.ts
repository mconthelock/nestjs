import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FlowRepository } from 'src/webform/flow/flow.repository';

const form = { NFRMNO: 1, VORGNO: 'ORG', CYEAR: '26', CYEAR2: '2026', NRUNNO: 1 };

function createFlowFixture() {
    const steps = [
        {
            CSTEPNO: '01',
            CSTEPNEXTNO: '02',
            CAPVTYPE: '3',
            CAPPLYALL: '0',
            VAPVNO: 'IS',
            VREPNO: 'IS',
            CSTEPST: '3',
            CAPVSTNO: '0',
        },
        {
            CSTEPNO: '01',
            CSTEPNEXTNO: '02',
            CAPVTYPE: '3',
            CAPPLYALL: '0',
            VAPVNO: 'GS',
            VREPNO: 'GS',
            CSTEPST: '3',
            CAPVSTNO: '0',
        },
        {
            CSTEPNO: '02',
            CSTEPNEXTNO: '00',
            CAPVTYPE: '1',
            CAPPLYALL: '0',
            VAPVNO: 'NEXT',
            VREPNO: 'NEXT',
            CSTEPST: '2',
            CAPVSTNO: '0',
        },
    ];
    const repo = {
        getEmpFlowStepReady: jest
            .fn()
            .mockImplementation(async (dto) =>
                steps.filter(
                    (step) =>
                        step.CSTEPST === '3' &&
                        (step.VAPVNO === dto.EMPNO || step.VREPNO === dto.EMPNO),
                ),
            ),
        doactionUpdateFlow: jest.fn().mockImplementation(async (flow, params) => {
            flow.CAPVSTNO = params.whatAction;
            flow.CSTEPST = params.stepAction;
        }),
        getFlow: jest.fn().mockImplementation(async (filter) =>
            steps.filter((step) => {
                const statuses = Array.isArray(filter.CAPVSTNO)
                    ? filter.CAPVSTNO
                    : [filter.CAPVSTNO];
                return (
                    (!filter.CSTEPNO || step.CSTEPNO === filter.CSTEPNO) &&
                    (!filter.CAPVSTNO || statuses.includes(step.CAPVSTNO))
                );
            }),
        ),
        getFlowTree: jest.fn().mockImplementation(async () => steps),
        updateStepNextStatus: jest.fn().mockImplementation(async (_form, stepNo) => {
            steps
                .filter((step) => step.CSTEPNO === stepNo)
                .forEach((step) => {
                    step.CSTEPST = '3';
                });
        }),
        updateNextStepWait: jest.fn(),
        updateSingleStep: jest.fn(),
    };
    const flow: DoactionFlowService = Object.assign(Object.create(DoactionFlowService.prototype), {
        repo,
        usersService: { findEmp: jest.fn().mockResolvedValue({}) },
        updateFromStatus: jest.fn(),
        sendMailToApprover: jest.fn(),
        APV_APPROVE: '1',
        APV_REJECT: '2',
        APV_NONE: '0',
        STEP_APPROVE: '5',
        STEP_REJECT: '6',
        STEP_WAIT: '2',
        STEP_NORMAL: '1',
        APV_TYPE_MULTIPLE_CO: '3',
    });
    const act = (empno: string, action: string) =>
        flow.doAction({ ...form, EMPNO: empno, ACTION: action }, '127.0.0.1', {
            holdUntilStepDone: action === 'reject',
        });
    return { steps, repo, flow, act };
}

describe('GP-TPH shared co-approver transitions', () => {
    it('does not open the next step before the other owner responds', async () => {
        const fixture = createFlowFixture();
        await fixture.act('IS', 'reject');
        expect(fixture.repo.updateStepNextStatus).not.toHaveBeenCalled();
        expect(fixture.repo.updateSingleStep).not.toHaveBeenCalled();
        await fixture.act('GS', 'approve');
        expect(fixture.repo.updateStepNextStatus).toHaveBeenCalledWith(form, '02');
        expect(fixture.flow.sendMailToApprover).toHaveBeenCalledWith(form);
    });

    it('skips remaining workflow steps when both owners reject', async () => {
        const fixture = createFlowFixture();
        await fixture.act('IS', 'reject');
        await fixture.act('GS', 'reject');
        expect(fixture.repo.updateSingleStep).toHaveBeenCalledWith(form);
        expect(fixture.repo.updateStepNextStatus).not.toHaveBeenCalled();
    });

    it('opens the next step when the last owner rejects but another approved', async () => {
        const fixture = createFlowFixture();
        await fixture.act('IS', 'approve');
        expect(fixture.repo.updateStepNextStatus).not.toHaveBeenCalled();
        await fixture.act('GS', 'reject');
        expect(fixture.repo.updateStepNextStatus).toHaveBeenCalledWith(form, '02');
        expect(fixture.repo.updateSingleStep).not.toHaveBeenCalled();
    });

    it('keeps a later step for the same representative pending until all Area Owners respond', async () => {
        const fixture = createFlowFixture();
        fixture.steps[0].VREPNO = 'REP';
        fixture.steps[0].CAPPLYALL = '1';
        fixture.steps[2].VAPVNO = 'REP';
        fixture.steps[2].VREPNO = 'REP';
        fixture.repo.doactionUpdateFlow.mockImplementation(async (current, params, currentStepOnly) => {
            fixture.steps.filter((step) =>
                step.CAPVSTNO === '0' &&
                (step.VAPVNO === params.VREALAPV || step.VREPNO === params.VREALAPV) &&
                (!currentStepOnly || step.CSTEPNO === current.CSTEPNO))
                .forEach((step) => {
                    step.CAPVSTNO = params.whatAction;
                    step.CSTEPST = params.stepAction;
                });
        });
        await fixture.flow.doAction(
            { ...form, EMPNO: 'REP', ACTION: 'approve' }, '127.0.0.1',
            { currentStepOnly: true },
        );
        expect(fixture.steps[2]).toMatchObject({ CAPVSTNO: '0', CSTEPST: '2' });
        await fixture.flow.doAction(
            { ...form, EMPNO: 'GS', ACTION: 'approve' }, '127.0.0.1',
            { currentStepOnly: true },
        );
        expect(fixture.steps[2]).toMatchObject({ CAPVSTNO: '0', CSTEPST: '3' });
    });

    it.each(['approve', 'reject'])('limits a GP-TPH %s to the current step', async (action) => {
        const fixture = createFlowFixture();
        await fixture.flow.doAction(
            { ...form, EMPNO: 'IS', ACTION: action }, '127.0.0.1',
            { currentStepOnly: true, holdUntilStepDone: action === 'reject' },
        );
        expect(fixture.repo.doactionUpdateFlow).toHaveBeenCalledWith(
            fixture.steps[0], expect.any(Object), true,
        );
        expect(fixture.steps[1].CAPVSTNO).toBe('0');
    });

    it.each(['return', 'returnp', 'returnb', 'returnE'])(
        'limits the initial %s update without changing the return transition',
        async (action) => {
            const fixture = createFlowFixture();
            Object.assign(fixture.repo, {
                updateStepWaitToNormal: jest.fn(), updateStepReadyToWait: jest.fn(),
                updateStepReqToReady: jest.fn(), updateAllStepToNormal: jest.fn(),
                updateStepReqNextToWait: jest.fn(), updateStepReqToReadyB: jest.fn(),
                updateStepNextExeToNormal: jest.fn(), updateStepExeToReady: jest.fn(),
                updateStepNextExeToWait: jest.fn(),
            });
            await fixture.flow.doAction(
                { ...form, EMPNO: 'IS', ACTION: action, CEXTDATA: '01' },
                '127.0.0.1', { currentStepOnly: true },
            );
            expect(fixture.repo.doactionUpdateFlow).toHaveBeenCalledWith(
                fixture.steps[0], expect.any(Object), true,
            );
        },
    );
});

describe('GP-TPH current-step update boundaries', () => {
    function createRepository() {
        const query = jest.fn();
        const repo: FlowRepository = Object.assign(Object.create(FlowRepository.prototype), {
            dataSource: { manager: { query } },
            APV_TYPE_SINGLE: '1', APV_TYPE_MULTIPLE_CO: '3',
            APPLY_ALL_NONE: '0', APPLY_ALL_APV: '1', APPLY_ALL_REJ: '2', APPLY_ALL_BOTH: '3',
        });
        return { repo, query };
    }

    it.each(['1', '3'])('ignores apply-all when restricting approver type %s', async (type) => {
        const { repo, query } = createRepository();
        await repo.doactionUpdateFlow(
            { CSTEPNO: '02', CAPVTYPE: type, CAPPLYALL: '1' },
            { ...form, VREALAPV: '07059', CAPVSTNO: '0' },
            true,
        );
        const [sql, values] = query.mock.calls[0];
        expect(sql).toContain('and CSTEPNO = :stepNo');
        expect(sql).not.toContain('or (CSTEPNO = :stepNo');
        expect(values.stepNo).toBe('02');
        if (type === '3') {
            expect(sql).toContain('and (VAPVNO = :apv1 or VREPNO = :rep1)');
            expect(values.apv1).toBe('07059');
            expect(values.rep1).toBe('07059');
        } else {
            expect(sql).not.toContain(':apv1');
        }
    });

    it.each([
        ['1', 'and (CSTEPNO = :stepNo or (VAPVNO = :apv1 or VREPNO = :rep1))'],
        ['3', 'and ((VAPVNO = :apv1 or VREPNO = :rep1) or (CSTEPNO = :stepNo'],
    ])('preserves apply-all behavior for approver type %s by default', async (type, clause) => {
        const { repo, query } = createRepository();
        await repo.doactionUpdateFlow(
            { CSTEPNO: '02', CAPVTYPE: type, CAPPLYALL: '1' },
            { ...form, VREALAPV: '07059', CAPVSTNO: '0' },
        );
        expect(query.mock.calls[0][0]).toContain(clause);
    });
});
