import { Injectable } from '@nestjs/common';
import { ApproveIetsDto } from './dto/approve-ie-ts.dto';
import { IetsFormRepository } from './iets_form/iets_form.repository';
import { IetsListService } from './iets_list/iets_list.service';
import { IetsListRepository } from './iets_list/iets_list.repository';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { VorgmstService } from 'src/webform/vorgmst/vorgmst.service';
import { OrgposRepository } from 'src/webform/orgpos/orgpos.repository';
import { FlowService } from 'src/webform/flow/flow.service';
import { FlowRepository } from 'src/webform/flow/flow.repository';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FormService } from 'src/webform/form/form.service';
import { Request } from 'express';
import { ORGPOS } from 'src/common/Entities/webform/table/ORGPOS.entity';
@Injectable()
export class IeTsApproveService {
    constructor(
        protected readonly repotsf: IetsFormRepository,
        private readonly repoorgpos: OrgposRepository,
        protected readonly servicetsl: IetsListService,
        protected readonly repotsl: IetsListRepository,
        private readonly formCreateService: FormCreateService,
        private readonly orgService: VorgmstService,
        private readonly flowService: FlowService,
        private readonly flowrepo: FlowRepository,
        protected readonly delService: DeleteFlowStepService,
        protected readonly doactionService: DoactionFlowService,
        protected readonly formService: FormService,
    ) {}
    async approve(dto: ApproveIetsDto, ip: string) {
        try {
            const { ACTION, EXTDATA, EMPNO, REMARK, DWGLIST } = dto;
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            // if (EXTDATA != 2) {
            const resact = await this.doactionService.doAction(
                {
                    ...form,
                    ACTION: ACTION,
                    EMPNO: EMPNO,
                    REMARK: REMARK,
                },
                ip,
            );
            let sql = '';
            let params = [
                dto.NFRMNO,
                dto.VORGNO,
                dto.CYEAR,
                dto.CYEAR2,
                dto.NRUNNO,
            ];
            let resflow;
            if (EXTDATA == 1 && ACTION == 'approve') {
                sql = `SELECT * FROM FLOW WHERE NFRMNO = :1 AND VORGNO = :2 AND CYEAR = :3 AND CYEAR2 = :4 AND NRUNNO = :5 AND CSTEPST IN ('3','2','1') AND CEXTDATA = '01'`;
                resflow = await this.flowrepo.execSql(sql, params);
                if (resflow && resflow.length == 0) {
                    sql = `SELECT * FROM FLOW WHERE NFRMNO = :1 AND VORGNO = :2 AND CYEAR = :3 AND CYEAR2 = :4 AND NRUNNO = :5 AND CSTEPST IN ('3','2','1') AND CEXTDATA = '02' AND VAPVNO = 'SYSTEM'`;
                    resflow = await this.flowrepo.execSql(sql, params);
                    if (resflow) {
                        for (const row of resflow) {
                            await this.delService.deleteFlowStep({
                                ...form,
                                CSTEPNO: row.CSTEPNO,
                            });
                        }
                    }
                    await this.flowService.updateFlow({
                        condition: { ...form, CEXTDATA: '02' },
                        CSTEPST: '3',
                    });
                    await this.flowService.updateFlow({
                        condition: { ...form, CEXTDATA: '03' },
                        CSTEPST: '2',
                    });
                }
            }
            if (EXTDATA == 2) {
                for (const dwg of DWGLIST) {
                    await this.repotsl.update(form, dwg);
                }
                sql = `SELECT * FROM FLOW WHERE NFRMNO = :1 AND VORGNO = :2 AND CYEAR = :3 AND CYEAR2 = :4 AND NRUNNO = :5 AND CSTEPST IN ('3','2','1') AND CEXTDATA = '02'`;
                resflow = await this.flowrepo.execSql(sql, params);
                if (resflow && resflow.length > 0) {
                    await this.flowService.updateFlow({
                        condition: { ...form, CSTEPST: '2' },
                        CSTEPST: '1',
                    });
                    await this.flowService.updateFlow({
                        condition: { ...form, CEXTDATA: '03' },
                        CSTEPST: '2',
                    });
                }
            }
            return {
                status: true,
                message: 'Approve successful',
            };
        } catch (error) {
            throw new Error('Approve IE-TS Form Error: ' + error.message);
        }
    }
}
