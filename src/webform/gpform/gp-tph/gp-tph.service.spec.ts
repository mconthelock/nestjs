import { BadRequestException } from '@nestjs/common';
import { GpTphService } from './gp-tph.service';
import { UpdateGpTphDto } from './dto/update-gp-tph.dto';

const form = { NFRMNO: 1, VORGNO: 'ORG', CYEAR: '26', CYEAR2: '2026', NRUNNO: 1 };

function createFixture() {
    const steps = [
        { CSTEPNO: '01', CEXTDATA: '01', VAPVNO: 'IS', VREPNO: 'IS-REP', CSTEPST: '3', CAPVSTNO: '0' },
        { CSTEPNO: '01', CEXTDATA: '01', VAPVNO: 'GS', VREPNO: 'GS-REP', CSTEPST: '3', CAPVSTNO: '0' },
    ];
    const records = [1, 2, 3, 4, 5].map((AREA_ID) => ({
        CYEAR2: '2026', NRUNNO: 1, AREA_ID, AREA_APPROVED: null,
        area: { AREA_OWNER_POSCODE: 'D', AREA_OWNER: AREA_ID <= 2 ? 'IS' : 'GS', AREA_LEVEL: 1 },
    }));
    const groups: Record<string, string[]> = { IS: ['IS'], GS: ['GS'] };
    const repo = {
        lockRequest: jest.fn().mockResolvedValue({}),
        findOne: jest.fn().mockResolvedValue({}),
        findList: jest.fn().mockResolvedValue([]),
        findAreaRecords: jest.fn().mockImplementation(async () => records),
        updateAreaApproval: jest.fn().mockImplementation(async (_form, areaId, approved) => {
            const record = records.find((item) => item.AREA_ID === areaId);
            if (!record) return { affected: 0 };
            record.AREA_APPROVED = approved;
            return { affected: 1 };
        }),
        approveGpTphConsecutiveSteps: jest.fn().mockResolvedValue(undefined),
        finalizeRejectedRequest: jest.fn().mockResolvedValue(undefined),
        restoreStatusAfterPartialAreaOwnerReject: jest.fn().mockResolvedValue(undefined),
    };
    const flow = {
        getEmpFlowStepReady: jest.fn().mockImplementation(async (dto) => steps.filter((step) =>
            step.CSTEPST === '3' && (step.VAPVNO === dto.EMPNO || step.VREPNO === dto.EMPNO))),
        getFlow: jest.fn().mockImplementation(async (filter) => steps.filter((step) =>
            (!filter.CSTEPNO || step.CSTEPNO === filter.CSTEPNO) &&
            (!filter.CEXTDATA || step.CEXTDATA === filter.CEXTDATA))),
        doAction: jest.fn().mockImplementation(async (dto) => {
            steps.filter((step) => step.CSTEPST === '3' &&
                (step.VAPVNO === dto.EMPNO || step.VREPNO === dto.EMPNO))
                .forEach((step) => {
                    step.CAPVSTNO = dto.ACTION === 'approve' ? '1' : '2';
                    step.CSTEPST = dto.ACTION === 'approve' ? '5' : '6';
                });
            return { status: true, message: 'success' };
        }),
        sendMailToApprover: jest.fn().mockResolvedValue(undefined),
    };
    const orgposService = {
        getOrgPos: jest.fn().mockImplementation(async ({ VORGNO }) =>
            (groups[VORGNO] || []).map((VEMPNO) => ({ VEMPNO }))),
    };
    const service: GpTphService = Object.assign(Object.create(GpTphService.prototype), {
        repo, doactionFlowService: flow, orgposService,
    });
    const act = (empno: string, areaIds: number[]) =>
        service.doAction({ ...form, EMPNO: empno, ACTION: 'approve', AREA_IDS: areaIds }, '127.0.0.1');
    return { service, repo, flow, steps, records, groups, act };
}

describe('GP-TPH area approvals', () => {
    it('saves each owner’s selections to AREA_APPROVED and continues when both approve one area', async () => {
        const fixture = createFixture();
        await fixture.act('IS', [1]);
        expect(fixture.records.map((row) => row.AREA_APPROVED)).toEqual(['1', '0', null, null, null]);
        await fixture.act('GS', [4]);
        expect(fixture.records.map((row) => row.AREA_APPROVED)).toEqual(['1', '0', '0', '1', '0']);
        expect(fixture.repo.finalizeRejectedRequest).not.toHaveBeenCalled();
        expect(fixture.flow.doAction.mock.calls.map(([dto]) => dto.ACTION)).toEqual(['approve', 'approve']);
        const result = await fixture.service.findOne(form);
        expect(result.AREA_RECORDS.map((row) => row.APPROVAL_STATUS))
            .toEqual(['approved', 'rejected', 'rejected', 'approved', 'rejected']);
    });

    it('waits for all owners and rejects when nobody approves any area', async () => {
        const fixture = createFixture();
        await fixture.act('IS', []);
        expect(fixture.repo.finalizeRejectedRequest).not.toHaveBeenCalled();
        expect(fixture.flow.doAction.mock.calls[0][2]).toEqual({ holdUntilStepDone: true });
        await fixture.act('GS', []);
        expect(fixture.records.every((row) => row.AREA_APPROVED === '0')).toBe(true);
        expect(fixture.repo.finalizeRejectedRequest).toHaveBeenCalledTimes(1);
        expect(fixture.flow.doAction.mock.calls.map(([dto]) => dto.ACTION)).toEqual(['reject', 'reject']);
    });

    it('continues and notifies the next step when the last owner selects no areas', async () => {
        const fixture = createFixture();
        await fixture.act('IS', [1]);
        await fixture.act('GS', []);
        expect(fixture.repo.finalizeRejectedRequest).not.toHaveBeenCalled();
        expect(fixture.repo.restoreStatusAfterPartialAreaOwnerReject).toHaveBeenCalledTimes(2);
        expect(fixture.flow.sendMailToApprover).toHaveBeenCalledWith(form);
    });

    it('continues when the first owner selects none and the last owner approves an area', async () => {
        const fixture = createFixture();
        await fixture.act('IS', []);
        await fixture.act('GS', [3]);
        expect(fixture.repo.finalizeRejectedRequest).not.toHaveBeenCalled();
        expect(fixture.records.map((row) => row.AREA_APPROVED)).toEqual(['0', '0', '1', '0', '0']);
    });

    it('rejects attempts to approve another owner’s areas or omit the selection', async () => {
        const fixture = createFixture();
        await expect(fixture.act('IS', [3])).rejects.toThrow(BadRequestException);
        await expect(fixture.service.doAction({
            ...form, EMPNO: 'IS', ACTION: 'approve',
        }, '127.0.0.1')).rejects.toThrow('AREA_IDS is required');
        expect(fixture.repo.updateAreaApproval).not.toHaveBeenCalled();
        expect(fixture.flow.doAction).not.toHaveBeenCalled();
    });

    it('allows a representative to decide only the represented owner’s areas', async () => {
        const fixture = createFixture();
        await fixture.act('IS-REP', [2]);
        expect(fixture.records.map((row) => row.AREA_APPROVED)).toEqual(['0', '1', null, null, null]);
    });

    it('keeps a shared area approved when any owner selects it', async () => {
        const fixture = createFixture();
        fixture.groups.IS.push('GS');
        await fixture.act('IS', [1]);
        await fixture.act('GS', []);
        const result = await fixture.service.findOne(form);
        expect(result.AREA_RECORDS.find((record) => record.AREA_ID === 1).APPROVAL_STATUS).toBe('approved');
        expect(fixture.records[0].AREA_APPROVED).toBe('1');
        expect(fixture.repo.finalizeRejectedRequest).not.toHaveBeenCalled();
    });

    it('shows a rejected shared area as pending until all its owners respond', async () => {
        const fixture = createFixture();
        fixture.groups.IS.push('GS');
        await fixture.act('IS', []);
        const result = await fixture.service.findOne(form, 'GS');
        expect(result.AREA_RECORDS[0].APPROVAL_STATUS).toBe('pending');
        expect(result.AREA_RECORDS[0].CAN_APPROVE).toBe(true);
    });

    it('exposes only the ready owner’s areas as selectable', async () => {
        const fixture = createFixture();
        const result = await fixture.service.findOne(form, 'GS-REP');
        expect(result.IS_AREA_OWNER_ACTION).toBe(true);
        expect(result.AREA_RECORDS.map((record) => record.CAN_APPROVE)).toEqual([false, false, true, true, true]);
    });

    it('stops if an existing request has incomplete owner mappings', async () => {
        const fixture = createFixture();
        fixture.groups.IS = [];
        await expect(fixture.act('GS', [3])).rejects.toThrow('assignments are incomplete');
        expect(fixture.flow.doAction).not.toHaveBeenCalled();
    });

    it('preserves legacy owner approvals when a later shared owner declines an area', async () => {
        const fixture = createFixture();
        fixture.groups.IS.push('GS');
        fixture.steps[0].CAPVSTNO = '1';
        fixture.steps[0].CSTEPST = '5';
        const before = await fixture.service.findOne(form, 'GS');
        expect(before.AREA_RECORDS[0].APPROVAL_STATUS).toBe('approved');
        await fixture.act('GS', []);
        expect(fixture.records[0].AREA_APPROVED).toBe('1');
    });

    it('reads legacy Y/N decisions and writes 1/0 when another owner responds', async () => {
        const fixture = createFixture();
        fixture.groups.IS.push('GS');
        fixture.steps[0].CAPVSTNO = '1';
        fixture.steps[0].CSTEPST = '5';
        fixture.records[0].AREA_APPROVED = 'Y';
        fixture.records[1].AREA_APPROVED = 'N';
        const before = await fixture.service.findOne(form, 'GS');
        expect(before.AREA_RECORDS[0].APPROVAL_STATUS).toBe('approved');
        expect(before.AREA_RECORDS[1].APPROVAL_STATUS).toBe('pending');
        await fixture.act('GS', [3]);
        expect(fixture.records[0].AREA_APPROVED).toBe('1');
        expect(fixture.records[1].AREA_APPROVED).toBe('0');
        const after = await fixture.service.findOne(form);
        expect(after.AREA_RECORDS[1].APPROVAL_STATUS).toBe('rejected');
    });

    it('clears recorded decisions when a return resets all Area Owners', async () => {
        const fixture = createFixture();
        await fixture.act('IS', [1]);
        await fixture.act('GS', [3]);
        fixture.steps.push({
            CSTEPNO: '02', CEXTDATA: '02', VAPVNO: 'ADMIN', VREPNO: 'ADMIN',
            CSTEPST: '3', CAPVSTNO: '0',
        });
        fixture.flow.doAction.mockImplementationOnce(async () => {
            fixture.steps.slice(0, 2).forEach((step) => { step.CAPVSTNO = '0'; });
            return { status: true, message: 'success' };
        });
        await fixture.service.doAction({ ...form, EMPNO: 'ADMIN', ACTION: 'returnp' }, '127.0.0.1');
        expect(fixture.records.every((record) => record.AREA_APPROVED === null)).toBe(true);
    });

    it('rejects a partial owner reset because one aggregate field cannot reconstruct decisions', async () => {
        const fixture = createFixture();
        await fixture.act('IS', [1]);
        await fixture.act('GS', [3]);
        fixture.steps.push({
            CSTEPNO: '02', CEXTDATA: '02', VAPVNO: 'ADMIN', VREPNO: 'ADMIN',
            CSTEPST: '3', CAPVSTNO: '0',
        });
        fixture.flow.doAction.mockImplementationOnce(async () => {
            fixture.steps[0].CAPVSTNO = '0';
            return { status: true, message: 'success' };
        });
        await expect(fixture.service.doAction({
            ...form, EMPNO: 'ADMIN', ACTION: 'returnb',
        }, '127.0.0.1')).rejects.toThrow('Cannot partially reset Area Owner decisions');
    });

    it('preserves area decisions when editing other request details', async () => {
        const fixture = createFixture();
        fixture.records[0].AREA_APPROVED = '1';
        Object.assign(fixture.repo, { replaceRequest: jest.fn().mockResolvedValue(undefined) });
        const dto = Object.assign(new UpdateGpTphDto(), {
            REQUEST_TYPE: 'E', REQUEST_SUB_TYPE: 'S', AREA_ID: [1, 2, 3, 4, 5], DETAILS: [{ EMP_CODE: 'EMP' }],
        });
        await fixture.service.update(form, dto);
        expect(fixture.repo['replaceRequest'].mock.calls[0][5]).toBe(false);
    });

    it('does not silently overwrite an unrecognized area approval value', async () => {
        const fixture = createFixture();
        fixture.records[0].AREA_APPROVED = 'X';
        await expect(fixture.act('IS', [1])).rejects.toThrow('Invalid area approval value');
        expect(fixture.repo.updateAreaApproval).not.toHaveBeenCalled();
    });

    it('does not replace areas after an owner has made a decision', async () => {
        const fixture = createFixture();
        fixture.records[0].AREA_APPROVED = '1';
        Object.assign(fixture.repo, {
            findAreasByIds: jest.fn().mockResolvedValue([
                { AREA_ID: 3, AREA_LEVEL: 1, AREA_OWNER_POSCODE: 'D', AREA_OWNER: 'GS' },
            ]),
            replaceRequest: jest.fn(),
        });
        Object.assign(fixture.service, { repService: { getRepresent: jest.fn().mockResolvedValue('REP') } });
        const dto = Object.assign(new UpdateGpTphDto(), {
            REQUEST_TYPE: 'E', REQUEST_SUB_TYPE: 'S', AREA_ID: [3], DETAILS: [{ EMP_CODE: 'EMP' }],
        });
        await expect(fixture.service.update(form, dto)).rejects.toThrow('alter an existing approval flow');
    });
});
