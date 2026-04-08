import { now } from 'src/common/utils/dayjs.utils';
import { doactionFlowDto } from './dto/doaction-flow.dto';
import { FlowService } from './flow.service';
import { FormDto } from '../form/dto/form.dto';
import { FlowRepository } from './flow.repository';
import { RepService } from '../rep/rep.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { FormmstService } from '../formmst/formmst.service';
import { FormService } from '../form/form.service';
import { UsersService } from 'src/amec/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DoactionFlowService extends FlowService {
    constructor(
        protected readonly repService: RepService,
        protected readonly repo: FlowRepository,
        private readonly usersService: UsersService,
        private readonly formmstService: FormmstService,
        private readonly mailService: MailService,
        private readonly formService: FormService,
    ) {
        super(repService, repo);
    }
    //------------------------------ Do action Start ------------------------------
    async doAction(
        dto: doactionFlowDto,
        ip: string,
    ): Promise<{
        status: boolean;
        message: string;
    }> {
        let whatAction: string,
            stepAction: string,
            params: any,
            updateFlow: boolean;
        try {
            const {
                NFRMNO,
                VORGNO,
                CYEAR,
                CYEAR2,
                NRUNNO,
                ACTION,
                EMPNO,
                REMARK = '',
            } = dto;
            const form = {
                NFRMNO: NFRMNO,
                VORGNO: VORGNO,
                CYEAR: CYEAR,
                CYEAR2: CYEAR2,
                NRUNNO: NRUNNO,
            };
            // CHECK USER INFO
            const userInfo = await this.usersService.findEmp(dto.EMPNO);
            
            if (!userInfo) {
                throw new Error('User not found');
            }
            // CHECK STEP STATUS
            const checkStep = await this.repo.getEmpFlowStepReady(dto);

            if (checkStep.length === 0) {
                throw new Error('Ready step not found!');
            }
            const flow = checkStep[0];
            params = {
                ...form,
                DAPVDATE: now(),
                CAPVTIME: now('HH:mm:ss'),
                VREMARK: REMARK,
                VREMOTE: ip,
                VREALAPV: EMPNO,
                CAPVSTNO: this.APV_NONE,
            };

            //UPDATE ALL STEP
            switch (ACTION) {
                case 'approve':
                    whatAction = this.APV_APPROVE;
                    stepAction = this.STEP_APPROVE;
                    await this.repo.doactionUpdateFlow(flow, {
                        ...params,
                        whatAction,
                        stepAction,
                    });
                    const checkNextStep = await this.repo.getFlow({
                        ...form,
                        CAPVSTNO: this.APV_NONE,
                        CSTEPNO: flow.CSTEPNO,
                    });
                    const updateNextStep =
                        checkNextStep.length == 0 ? true : false;
                    if (updateNextStep) {
                        const stepNext:
                            | ''
                            | {
                                  stepno: string;
                                  stepNextNo: string;
                              } = await this.getStepNext(form);
                        if (!stepNext) break;
                        //UPDATE STEP NEXT STATUS
                        await this.repo.updateStepNextStatus(
                            form,
                            stepNext.stepno,
                        );
                        //UPDATE NEXT NEXT STEP (WAIT)
                        if (stepNext.stepNextNo != '00') {
                            await this.repo.updateNextStepWait(
                                form,
                                stepNext.stepno,
                            );
                        }
                        await this.sendMailToApprover(form); // send email to approver
                    }
                    break;
                case 'reject':
                    whatAction = this.APV_REJECT;
                    stepAction = this.STEP_REJECT;
                    await this.repo.doactionUpdateFlow(flow, {
                        ...params,
                        whatAction,
                        stepAction,
                    });
                    //Check for updating flow status
                    if (flow.CAPVTYPE == this.APV_TYPE_MULTIPLE_CO) {
                        const checkUpdate = await this.repo.getFlow({
                            ...form,
                            CAPVSTNO: [this.APV_NONE, this.APV_APPROVE],
                            CSTEPNO: flow.CSTEPNO,
                        });
                        updateFlow = checkUpdate.length == 0 ? true : false;
                    } else {
                        updateFlow = true;
                    }
                    const stepNext:
                        | ''
                        | {
                              stepno: string;
                              stepNextNo: string;
                          } = await this.getStepNext(form);
                    if (!stepNext) break;
                    //Start updating flow status
                    if (updateFlow) {
                        //UPDATE SINGLE STEP
                        await this.repo.updateSingleStep(form);
                    } else {
                        //UPDATE STEP NEXT STATUS
                        await this.repo.updateStepNextStatus(
                            form,
                            stepNext.stepno,
                        );
                        //UPDATE NEXT NEXT STEP (WAIT)
                        if (stepNext.stepNextNo != '00') {
                            await this.repo.updateNextStepWait(
                                form,
                                stepNext.stepno,
                            );
                        }
                    }
                    break;
                case 'return':
                    whatAction = this.APV_NONE;
                    stepAction = this.STEP_READY;
                    await this.repo.doactionUpdateFlow(flow, {
                        ...params,
                        whatAction,
                        stepAction,
                    });
                    await this.repo.updateStepWaitToNormal(form);
                    await this.repo.updateStepReadyToWait(form);
                    await this.repo.updateStepReqToReady(form);
                    break;
                case 'returnp':
                    whatAction = this.APV_NONE;
                    stepAction = this.STEP_READY;
                    await this.repo.doactionUpdateFlow(flow, {
                        ...params,
                        whatAction,
                        stepAction,
                    });
                    await this.repo.updateAllStepToNormal(form);
                    await this.repo.updateStepReqToReady(form);
                    await this.repo.updateStepReqNextToWait(form);
                    break;
                case 'returnb':
                    whatAction = this.APV_NONE;
                    stepAction = this.STEP_READY;
                    await this.repo.doactionUpdateFlow(flow, {
                        ...params,
                        whatAction,
                        stepAction,
                    });
                    await this.repo.updateStepWaitToNormal(form);
                    await this.repo.updateStepReadyToWait(form);
                    await this.repo.updateStepReqToReadyB(form);
                    break;
                case 'returnE':
                    if (!dto.CEXTDATA) {
                        throw new Error(
                            'CEXTDATA is required for returnE action',
                        );
                    }
                    whatAction = this.APV_NONE;
                    stepAction = this.STEP_READY;
                    await this.repo.doactionUpdateFlow(flow, {
                        ...params,
                        whatAction,
                        stepAction,
                    });
                    await this.repo.updateStepNextExeToNormal(
                        form,
                        dto.CEXTDATA,
                    ); // step ต่อจาก exe ทั้งหมดเป็น 1
                    await this.repo.updateStepExeToReady(form, dto.CEXTDATA); // step ที่ exe เป็น 3
                    await this.repo.updateStepNextExeToWait(form, dto.CEXTDATA); // step ต่อจาก exe เป็น 2
                    break;
                default:
                    throw new Error('Invalid action!');
            }

            await this.updateFromStatus(form);

            return {
                status: true,
                message: 'Do action success!',
            };
        } catch (error) {
            throw new Error('Do action Error: ' + error.message);
        }
    }

    async execSql(
        sql: string,
        params: any,
        message?: string,
    ): Promise<{ status: boolean; result?: any; message: string }> {
        let msg = message || 'Update Flow ';
        try {
            const res = await this.repo.execSql(sql, params);
            if (!res) {
                throw new Error(', No rows updated');
            } else {
                return { status: true, result: res, message: msg + 'success' };
            }
        } catch (error) {
            throw new Error(msg + error.message);
        }
    }

    async getStepNext(form: FormDto) {
        const flowTree = (await this.repo.getFlowTree(form)) ?? [];
        for (const step of flowTree) {
            if (
                step.CSTEPST == this.STEP_WAIT ||
                step.CSTEPST == this.STEP_NORMAL
            ) {
                return { stepno: step.CSTEPNO, stepNextNo: step.CSTEPNEXTNO };
            }
        }
        return '';
    }

    async updateFromStatus(form: FormDto) {
        let flowStatus: string = '';
        //FIND UNFINISH STEP
        if (!(await this.checkUnfinishedFlow(form))) {
            //FIND REJECT STEP
            const reject = await this.getFlow({
                distinct: true,
                fields: ['CSTEPNO', 'VAPVNO', 'CAPVTYPE'],
                ...form,
                CAPVSTNO: this.APV_REJECT,
            });
            if (reject.length == 0) {
                flowStatus = this.FLOW_APPROVE;
            } else {
                for (const step of reject) {
                    if (step.CAPVTYPE == this.APV_TYPE_SINGLE) {
                        flowStatus = this.FLOW_REJECT;
                        break;
                    } else {
                        const stepApv = await this.getFlow({
                            distinct: true,
                            fields: ['CSTEPNO'],
                            ...form,
                            CSTEPNO: step.CSTEPNO,
                            CAPVSTNO: this.APV_APPROVE,
                        });
                        if (stepApv.length > 0) {
                            flowStatus = this.FLOW_REJECT;
                            break;
                        } else {
                            flowStatus = this.FLOW_APPROVE;
                        }
                    }
                }
            }
            // UPDATE FLOW STATUS
            await this.formService.updateForm({
                condition: form,
                CST: flowStatus,
            });
        }
    }

    async checkUnfinishedFlow(form: FormDto): Promise<boolean> {
        const res = await this.getFlow({
            ...form,
            CAPVSTNO: this.APV_NONE,
        });
        return res.length > 0;
    }

    async sendMailToApprover(form: FormDto) {
        const res = await this.getNameReq(form);
        if (res.result.length > 0) {
            const req = res.result[0];
            const frmmst = await this.formmstService.getFormmst({
                NNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
            });
            const formNumber = await this.formService.getFormno(form);
            const subject = `E-Form ${formNumber} from ${req.SNAME}`;
            const listApv = await this.getEmailApvNext(form);
            let html = `Please approve/reject ${frmmst[0].VNAME} From:${req.SNAME}<br/>`;
            html += '1. Get into http://webflow/form<br/>';
            html += "2. select 'Electronic forms'<br/>";
            html += "3. select 'Waiting for approval'<br/>";
            if (listApv.result.length > 0) {
                for (const list of listApv.result) {
                    this.mailService.sendMail({
                        from: 'webflow_admin@MitsubishiElevatorAsia.co.th',
                        to: list.VEMAIL,
                        // to: process.env.MAIL_ADMIN,
                        subject,
                        html,
                    });
                }
            }
        }
    }

    async getNameReq(form: FormDto) {
        const sql =
            'select a.SNAME as SNAME , a.SRECMAIL as SRECMAIL from form f , amecuserall a where a.SEMPNO = f.VREQNO and NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO';
        return await this.execSql(sql, form);
    }

    async getEmailApvNext(form: FormDto) {
        const sql = `select distinct VEMAIL from emailAck where NFRMNO = :NFRMNO and VORGNO = :VORGNO and CYEAR = :CYEAR and VEMPNO in (select VAPVNO as APPROVER from flow where NFRMNO = :frmno and VORGNO = :orgno and CYEAR = :y and CYEAR2 = :y2 and NRUNNO = :runno and CSTEPST = '3' union select VREPNO from flow where NFRMNO = :frmno2 and VORGNO = :orgno2 and CYEAR = :cy and CYEAR2 = :cy2 and NRUNNO = :runno2 and CSTEPST = '3') and CSTNO = '1'`;
        const params = {
            NFRMNO: form.NFRMNO,
            VORGNO: form.VORGNO,
            CYEAR: form.CYEAR,
            frmno: form.NFRMNO,
            orgno: form.VORGNO,
            y: form.CYEAR,
            y2: form.CYEAR2,
            runno: form.NRUNNO,
            frmno2: form.NFRMNO,
            orgno2: form.VORGNO,
            cy: form.CYEAR,
            cy2: form.CYEAR2,
            runno2: form.NRUNNO,
        };
        return await this.execSql(sql, params);
    }
    //------------------------------- Do action End ---------------------------------
}
