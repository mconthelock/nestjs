import { DoactionFlowService } from 'src/webform/flow/doaction.service';

const form = { NFRMNO: 1, VORGNO: 'ORG', CYEAR: '26', CYEAR2: '2026', NRUNNO: 1 };

function createFlowFixture() {
    const steps = [
        { CSTEPNO: '01', CSTEPNEXTNO: '02', CAPVTYPE: '3', CAPPLYALL: '0',
            VAPVNO: 'IS', VREPNO: 'IS', CSTEPST: '3', CAPVSTNO: '0' },
        { CSTEPNO: '01', CSTEPNEXTNO: '02', CAPVTYPE: '3', CAPPLYALL: '0',
            VAPVNO: 'GS', VREPNO: 'GS', CSTEPST: '3', CAPVSTNO: '0' },
        { CSTEPNO: '02', CSTEPNEXTNO: '00', CAPVTYPE: '1', CAPPLYALL: '0',
            VAPVNO: 'NEXT', VREPNO: 'NEXT', CSTEPST: '2', CAPVSTNO: '0' },
    ];
    const repo = {
        getEmpFlowStepReady: jest.fn().mockImplementation(async (dto) => steps.filter((step) =>
            step.CSTEPST === '3' && (step.VAPVNO === dto.EMPNO || step.VREPNO === dto.EMPNO))),
        doactionUpdateFlow: jest.fn().mockImplementation(async (flow, params) => {
            flow.CAPVSTNO = params.whatAction;
            flow.CSTEPST = params.stepAction;
        }),
        getFlow: jest.fn().mockImplementation(async (filter) => steps.filter((step) => {
            const statuses = Array.isArray(filter.CAPVSTNO) ? filter.CAPVSTNO : [filter.CAPVSTNO];
            return (!filter.CSTEPNO || step.CSTEPNO === filter.CSTEPNO) &&
                (!filter.CAPVSTNO || statuses.includes(step.CAPVSTNO));
        })),
        getFlowTree: jest.fn().mockImplementation(async () => steps),
        updateStepNextStatus: jest.fn().mockImplementation(async (_form, stepNo) => {
            steps.filter((step) => step.CSTEPNO === stepNo).forEach((step) => { step.CSTEPST = '3'; });
        }),
        updateNextStepWait: jest.fn(),
        updateSingleStep: jest.fn(),
    };
    const flow: DoactionFlowService = Object.assign(Object.create(DoactionFlowService.prototype), {
        repo,
        usersService: { findEmp: jest.fn().mockResolvedValue({}) },
        updateFromStatus: jest.fn(),
        sendMailToApprover: jest.fn(),
        APV_APPROVE: '1', APV_REJECT: '2', APV_NONE: '0',
        STEP_APPROVE: '5', STEP_REJECT: '6', STEP_WAIT: '2', STEP_NORMAL: '1',
        APV_TYPE_MULTIPLE_CO: '3',
    });
    const act = (empno: string, action: string) => flow.doAction(
        { ...form, EMPNO: empno, ACTION: action }, '127.0.0.1',
        { holdUntilStepDone: action === 'reject' },
    );
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
});
