import { BadRequestException } from '@nestjs/common';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FlowRepository } from 'src/webform/flow/flow.repository';
import { GpTphRepository } from './gp-tph.repository';
import { GpTphService } from './gp-tph.service';

const form = { NFRMNO: 1, VORGNO: 'ORG', CYEAR: '26', CYEAR2: '2026', NRUNNO: 1 };

function createFixture() {
    const steps = [
        { CSTEPNO: '01', CSTEPNEXTNO: '02', CEXTDATA: 'MG', CAPVTYPE: '1', CAPPLYALL: '1',
            VAPVNO: '95025', VREPNO: '07059', CSTEPST: '3', CAPVSTNO: '0' },
        { CSTEPNO: '02', CSTEPNEXTNO: '03', CEXTDATA: '01', CAPVTYPE: '3', CAPPLYALL: '0',
            VAPVNO: '95025', VREPNO: '07059', CSTEPST: '2', CAPVSTNO: '0' },
        { CSTEPNO: '02', CSTEPNEXTNO: '03', CEXTDATA: '01', CAPVTYPE: '3', CAPPLYALL: '0',
            VAPVNO: 'OTHER', VREPNO: 'OTHER', CSTEPST: '2', CAPVSTNO: '0' },
        { CSTEPNO: '03', CSTEPNEXTNO: '00', CEXTDATA: '', CAPVTYPE: '1', CAPPLYALL: '0',
            VAPVNO: 'NEXT', VREPNO: 'NEXT', CSTEPST: '1', CAPVSTNO: '0' },
    ];
    const records = [
        { AREA_ID: 1, AREA_APPROVED: null, area: { AREA_OWNER_POSCODE: 'D', AREA_OWNER: 'A' } },
        { AREA_ID: 2, AREA_APPROVED: null, area: { AREA_OWNER_POSCODE: 'D', AREA_OWNER: 'B' } },
    ];
    const query = jest.fn().mockImplementation(async (sql, params) => {
        const current = steps.find((step) => step.CSTEPNO === params.stepNo);
        for (const step of steps) {
            const sameActor = step.VAPVNO === params.VREALAPV || step.VREPNO === params.VREALAPV;
            const selected = current.CAPVTYPE === '1' && current.CAPPLYALL === '1'
                ? step.CSTEPNO === current.CSTEPNO || sameActor
                : step.CSTEPNO === current.CSTEPNO && sameActor;
            const excluded = sql.includes(':excludedStepTag') &&
                step.CSTEPNO !== current.CSTEPNO &&
                step.CEXTDATA.trim() === params.excludedStepTag;
            if (selected && !excluded && step.CAPVSTNO === '0') {
                step.CAPVSTNO = params.whatAction;
                step.CSTEPST = params.stepAction;
            }
        }
    });
    const updateRepo: FlowRepository = Object.assign(Object.create(FlowRepository.prototype), {
        dataSource: { manager: { query } },
        APV_TYPE_SINGLE: '1', APV_TYPE_MULTIPLE_CO: '3',
        APPLY_ALL_NONE: '0', APPLY_ALL_APV: '1', APPLY_ALL_REJ: '2', APPLY_ALL_BOTH: '3',
    });
    const flowRepo = {
        getEmpFlowStepReady: jest.fn().mockImplementation(async (dto) => steps.filter((step) =>
            step.CSTEPST === '3' && (step.VAPVNO === dto.EMPNO || step.VREPNO === dto.EMPNO))),
        doactionUpdateFlow: updateRepo.doactionUpdateFlow.bind(updateRepo),
        getFlow: jest.fn().mockImplementation(async (filter) => steps.filter((step) => {
            const statuses = Array.isArray(filter.CAPVSTNO) ? filter.CAPVSTNO : [filter.CAPVSTNO];
            return (!filter.CSTEPNO || step.CSTEPNO === filter.CSTEPNO) &&
                (!filter.CEXTDATA || step.CEXTDATA === filter.CEXTDATA) &&
                (!filter.CAPVSTNO || statuses.includes(step.CAPVSTNO));
        })),
        getFlowTree: jest.fn().mockImplementation(async () => steps),
        updateStepNextStatus: jest.fn().mockImplementation(async (_form, stepNo) => {
            steps.filter((step) => step.CSTEPNO === stepNo && ['1', '2'].includes(step.CSTEPST))
                .forEach((step) => { step.CSTEPST = '3'; });
        }),
        updateNextStepWait: jest.fn(),
    };
    const flow: DoactionFlowService = Object.assign(Object.create(DoactionFlowService.prototype), {
        repo: flowRepo,
        usersService: { findEmp: jest.fn().mockResolvedValue({}) },
        updateFromStatus: jest.fn(),
        sendMailToApprover: jest.fn(),
        APV_APPROVE: '1', APV_REJECT: '2', APV_NONE: '0',
        STEP_APPROVE: '5', STEP_REJECT: '6', STEP_WAIT: '2', STEP_NORMAL: '1',
        APV_TYPE_MULTIPLE_CO: '3',
    });
    const consecutiveRepo: GpTphRepository = Object.assign(Object.create(GpTphRepository.prototype), {
        dataSource: { manager: {
            getRepository: () => ({ findBy: async ({ CSTEPNO }) => steps.filter((step) => step.CSTEPNO === CSTEPNO) }),
            query: jest.fn(),
        } },
    });
    const repo = {
        lockRequest: jest.fn().mockResolvedValue({}),
        findAreaRecords: jest.fn().mockImplementation(async () => records),
        updateAreaApproval: jest.fn().mockImplementation(async (_form, areaId, approved) => {
            records.find((record) => record.AREA_ID === areaId).AREA_APPROVED = approved;
            return { affected: 1 };
        }),
        approveGpTphConsecutiveSteps: consecutiveRepo.approveGpTphConsecutiveSteps.bind(consecutiveRepo),
        restoreStatusAfterPartialAreaOwnerReject: jest.fn(),
    };
    const orgposService = {
        getOrgPos: jest.fn().mockImplementation(async ({ VORGNO }) =>
            [{ VEMPNO: VORGNO === 'A' ? '95025' : 'OTHER' }]),
    };
    const service: GpTphService = Object.assign(Object.create(GpTphService.prototype), {
        repo, doactionFlowService: flow, orgposService,
    });
    return { service, steps, records, query };
}

describe('GP-TPH Area Owner approval boundary', () => {
    it.each(['95025', '07059'])(
        'requires a separate Area Owner decision after supervisor %s approves',
        async (actor) => {
            const fixture = createFixture();
            await fixture.service.doAction({ ...form, EMPNO: actor, ACTION: 'approve' }, '127.0.0.1');

            expect(fixture.steps[0]).toMatchObject({ CAPVSTNO: '1', CSTEPST: '5' });
            expect(fixture.steps[1]).toMatchObject({ CAPVSTNO: '0', CSTEPST: '3' });
            expect(fixture.steps[2]).toMatchObject({ CAPVSTNO: '0', CSTEPST: '3' });
            expect(fixture.records.map((record) => record.AREA_APPROVED)).toEqual([null, null]);
            expect(fixture.query.mock.calls[0][0]).toContain(':excludedStepTag');

            await expect(fixture.service.doAction(
                { ...form, EMPNO: actor, ACTION: 'approve' }, '127.0.0.1',
            )).rejects.toThrow(BadRequestException);
            await fixture.service.doAction(
                { ...form, EMPNO: actor, ACTION: 'approve', AREA_IDS: [1] }, '127.0.0.1',
            );
            expect(fixture.steps[1]).toMatchObject({ CAPVSTNO: '1', CSTEPST: '5' });
            expect(fixture.steps[2]).toMatchObject({ CAPVSTNO: '0', CSTEPST: '3' });
            expect(fixture.records.map((record) => record.AREA_APPROVED)).toEqual(['1', null]);
        },
    );
});
