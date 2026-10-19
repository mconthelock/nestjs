import { BadRequestException, Injectable } from '@nestjs/common';
import { OrgposService } from 'src/webform/orgpos/orgpos.service';
import { RepService } from 'src/webform/rep/rep.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { FormDto } from 'src/webform/form/dto/form.dto';

export interface RejectFlowPlan { sup: string; foreman: string; sem: string; ddem: string; dem: string; requester: string; department: string; tid: number; wid: number; }
@Injectable()
export class PilineRejectFlowService {
    constructor(private readonly orgpos: OrgposService, private readonly rep: RepService,
        private readonly flow: FlowService, private readonly deletion: DeleteFlowStepService) {}

    async plan(requester: { SEMPNO: string; SSECCODE: string; SDEPCODE: string }, section: string, tid: number, wid: number): Promise<RejectFlowPlan> {
        const position = async (code: string, pos: string, prefix = false) => {
            const rows = await this.orgpos.getOrgPos(prefix ? { VPOSNO: pos } : { VORGNO: code, VPOSNO: pos });
            return rows.find(row => !prefix || row.VORGNO?.trim().startsWith(code))?.VEMPNO?.trim() || '';
        };
        const foreman = await position(requester.SSECCODE.trim(), '50');
        const overrides: Record<string,string> = { '000404':'05030','000502':'05056','000503':'09058','000504':'95129' };
        const sup = overrides[requester.SSECCODE.trim()] || await position(requester.SSECCODE.trim(), '49') || foreman;
        const prefix = section.slice(0,4);
        const ddem = await position(prefix,'21',true);
        const dem = await position(prefix,'20',true);
        const sem = await position(section,'30') || ddem || dem;
        if (!sup || !foreman || !sem) throw new BadRequestException('ไม่พบผู้อนุมัติ Supervisor / Foreman / SEM กรุณาตรวจสอบ ORGPOS');
        return {sup,foreman,sem,ddem,dem,requester:requester.SEMPNO.trim(),department:requester.SDEPCODE.trim(),tid,wid};
    }

    async apply(key: FormDto, plan: RejectFlowPlan) {
        const exists = async (step: string) => (await this.flow.getFlow({...key,CSTEPNO:step})).length > 0;
        const remove = async (step: string) => {
            if (!await exists(step)) return;
            const result = await this.deletion.deleteFlowStep({...key,CSTEPNO:step});
            if (!result.status) throw new Error(result.message);
        };
        const update = async (step: string, values: { VAPVNO?: string; VREPNO?: string; CAPPLYALL?: string }) => {
            if (!await exists(step)) return;
            const result = await this.flow.updateFlow({condition:{...key,CSTEPNO:step},...values});
            if (!result.status) throw new Error(result.message);
        };
        if (![1,2].includes(plan.wid)) { await remove('52'); await remove('59'); }
        // Trial requester steps are separate from the non-Scrap steps 52/59.
        if (plan.department === '000501' && plan.tid === 3) {
            for (const step of ['51','58']) await update(step,{VAPVNO:plan.requester,VREPNO:plan.requester});
        }
        await update('--',{CAPPLYALL:'0'});
        await update('63',{VAPVNO:plan.sup,VREPNO:plan.foreman});
        const represent = (empno: string) => this.rep.getRepresent({NFRMNO:key.NFRMNO,VORGNO:key.VORGNO,CYEAR:key.CYEAR,VEMPNO:empno});
        const semRep = await represent(plan.sem);
        for (const step of ['10','18']) await update(step,{VAPVNO:plan.sem,VREPNO:semRep});
        if (!plan.ddem) await remove('13');
        else await update('13',{VAPVNO:plan.ddem,VREPNO:await represent(plan.ddem)});
        if (plan.dem) await update('11',{VAPVNO:plan.dem,VREPNO:await represent(plan.dem)});
    }
}

