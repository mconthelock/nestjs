import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { transactionContext } from 'src/common/interceptors/transaction-context';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { InsertFlowStepService } from 'src/webform/flow/insert-flow-step.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { FORM_KEYS, checkpointResult } from './jig.utils';
import { JigFormKeyDto } from './dto/jig-form.dto';

@Injectable()
export class JigFlowService {
    constructor(
        @InjectDataSource('webformConnection') private readonly webform: DataSource,
        private readonly flows: FlowService,
        private readonly insert: InsertFlowStepService,
        private readonly remove: DeleteFlowStepService,
    ) {}

    async configure(key: JigFormKeyDto, picCode?: string) {
        // Shared Flow services own WEBFORM metadata and unqualified SQL.
        // Run after the JIG save commits, on their own connection and transaction.
        return this.webform.transaction(manager => transactionContext.run({ manager }, async () => {
            const where = FORM_KEYS.map((k, i) => `${k} = :${i + 1}`).join(' AND ');
            const params = FORM_KEYS.map(k => key[k]);
            const forms = await manager.query(`SELECT CST FROM WEBFORM.FORM WHERE ${where} FOR UPDATE`, params);
            if (!forms.length || !['0','1'].includes(String(forms[0].CST).trim()))
                throw new BadRequestException('Only a prepared or running form can be edited');
            const snapshot = await manager.query(`SELECT JIG_NO FROM IEDOC.JIG_FORM WHERE ${where}`, params);
            if (!snapshot.length) throw new BadRequestException('JIG form not found');
            const ng = await manager.query(`SELECT NFRMNO FROM IEDOC.JIG_FORM_NG WHERE ${where}`, params);
            const details = await manager.query(`SELECT MIN, MAX, MEASURED_VALUE, RESULT FROM IEDOC.JIG_FORM_DETAIL WHERE ${where}`, params);
            const hasNg = ng.length > 0 || details.some(p => checkpointResult(p) === 'NG');
            await this.configureSteps(key, hasNg, picCode);
            return { updated: true, hasNg, nextStep: hasNg ? '07' : '04' };
        }));
    }

    private async configureSteps(key: JigFormKeyDto, hasNg: boolean, picCode?: string) {
        const original = await this.flows.getFlow(key);
        const source = (step: string) => {
            const rows = original.filter(row => row.CSTEPNO.trim() === step);
            if (rows.length !== 1) throw new BadRequestException(`Expected one approver in step ${step}`);
            return rows[0];
        };
        if (!hasNg) {
            // Delete from tail to head; the shared service reconnects each predecessor.
            for (const step of ['85', '19', '07']) {
                if (!(await this.flows.getFlow({ ...key, CSTEPNO: step })).length) continue;
                const result = await this.remove.deleteFlowStep({ ...key, CSTEPNO: step });
                if (!result.status) throw new Error(result.message);
            }
            await this.flows.updateFlow({ condition: { ...key, CSTEPNO: '06' }, CSTEPNEXTNO: '04' });
            return;
        }
        if (!picCode?.trim()) throw new BadRequestException('PICCODE is required when the form has NG');
        const requester = source('--'), sem = source('06');
        const steps = [
            { step: '07', before: '06', next: '19', apv: picCode.trim(), rep: picCode.trim() },
            { step: '19', before: '07', next: '85', apv: requester.VAPVNO, rep: requester.VREPNO },
            { step: '85', before: '19', next: '04', apv: sem.VAPVNO, rep: sem.VREPNO },
        ];
        // Repair any partial chain using only steps that exist before insertion.
        const present = ['06', ...steps.filter(s => original.some(f => f.CSTEPNO.trim() === s.step)).map(s => s.step), '04'];
        for (let i = 0; i < present.length - 1; i++)
            await this.flows.updateFlow({ condition: { ...key, CSTEPNO: present[i] }, CSTEPNEXTNO: present[i + 1] });
        for (const row of steps) {
            if (!(await this.flows.getFlow({ ...key, CSTEPNO: row.step })).length) {
                const result = await this.insert.insertFlowStep({ ...key, NEWSTEPNO: row.step,
                    BEFORESTEPNO: row.before, CTYPE: '3', APVNO: row.apv });
                if (!result.status) throw new Error(result.message);
            }
        }
        for (const row of steps) {
            // Shared insertion resolves substitutes itself; restore the exact source pair.
            await this.flows.updateFlow({ condition: { ...key, CSTEPNO: row.step },
                VAPVNO: row.apv, VREPNO: row.rep, CSTEPNEXTNO: row.next });
            await this.flows.updateFlow({ condition: { ...key, CSTEPNO: row.before }, CSTEPNEXTNO: row.step });
        }
    }
}
