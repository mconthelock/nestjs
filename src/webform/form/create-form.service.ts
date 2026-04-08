import { Injectable } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { FlowmstService } from '../flowmst/flowmst.service';
import { UsersService } from 'src/amec/users/users.service';
import { OrgTreeService } from '../org-tree/org-tree.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlowService } from '../flow/flow.service';
import { FormRepository } from './form.repository';
import { FormmstService } from '../formmst/formmst.service';
import { OrgposService } from '../orgpos/orgpos.service';
import { SequenceOrgService } from '../sequence-org/sequence-org.service';
import { RepService } from '../rep/rep.service';
import { DeleteFlowStepService } from '../flow/delete-flow-step.service';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

interface FormContext {
    ip: string;
    empno: string;
    inputempno: string;
    remark: string;
    nfrmno: number;
    vorgno: string;
    cyear: string;
    cyear2: string;
    CSTEPSTDX: number;
    flag?: number;
    nrunno?: number;
    emppos?: string;
    orgno?: string;
    represent?: string;
    VAPVNO?: string;
    CSTEPST?: number;
    query?: any;
}

@Injectable()
export class FormCreateService extends FormService {
    constructor(
        @InjectRepository(FORM, 'webformConnection')
        protected readonly form: Repository<FORM>,

        @InjectRepository(FLOW, 'webformConnection')
        protected readonly flow: Repository<FLOW>,
        protected readonly formmstService: FormmstService,
        protected readonly flowService: FlowService,
        protected readonly repo: FormRepository,

        // services for create form
        private readonly usersService: UsersService,
        private readonly orgTreeService: OrgTreeService,
        private readonly flowmstService: FlowmstService,
        private readonly orgPosService: OrgposService,
        private readonly sequenceOrgService: SequenceOrgService,
        private readonly repService: RepService,
        private readonly deleteFlowStepService: DeleteFlowStepService,
    ) {
        super(form, flow, formmstService, flowService, repo);
    }
    async create(dto: CreateFormDto, ip: string) {
        try {
            const context: FormContext = {
                ip: ip,
                empno: dto.REQBY,
                inputempno: dto.INPUTBY,
                remark: dto.REMARK,
                nfrmno: dto.NFRMNO,
                vorgno: dto.VORGNO,
                cyear: dto.CYEAR,
                cyear2: new Date().getFullYear().toString(),
                CSTEPSTDX: 4,
            };

            this.setQuery(context);
            await this.setFormNo(context);
            const formData = await this.setFormValue(context);
            if (await this.insertForm(formData)) {
                context.flag = 0;
                const flowMaster = await this.flowmstService.getFlowMaster(
                    context.nfrmno,
                    context.vorgno,
                    context.cyear,
                );
                await this.setOrganize(context);
                for (const row of flowMaster) {
                    switch (row.CTYPE) {
                        case '1':
                            await this.addFlow1(row, context);
                            break;
                        case '2':
                            await this.addFlow2(row, context);
                            break;
                        case '3':
                            context.VAPVNO = row.VAPVNO;
                            context.CSTEPST =
                                context.CSTEPSTDX <= 1
                                    ? 1
                                    : context.CSTEPSTDX - 1;
                            context.CSTEPSTDX--;
                            await this.getRepresent(row.VAPVNO, context);
                            const flow = this.setFlow(row, context);
                            await this.flowService.insertFlow(flow);
                            break;
                        default:
                            break;
                    }
                }
                // add first step
                // Unset CSTEPST from this.query if it exists
                if (context.query && 'CSTEPST' in context.query) {
                    delete context.query['CSTEPST'];
                }
                context.query.CSTEPST = '3';
                context.query.NRUNNO = context.nrunno;

                const first = await this.flowService.getFlow(context.query);
                await this.firstflow(first, context);
                // add manager
                if (context.flag == 1) {
                    await this.managerStep(context);
                }
                context.query.CSTEPST = '0';
                const notuse = await this.flowService.getFlow(context.query);
                for (const row of notuse) {
                    const deleteResult =
                        await this.deleteFlowStepService.deleteFlowStep(row);
                    if (!deleteResult.status) {
                        throw new Error(deleteResult.message);
                    }
                }

                //Draft form
                if (dto.DRAFT) {
                    await this.saveDraft(dto.DRAFT, context);
                }
                return {
                    status: true,
                    message: {
                        message: 'Insert form successful',
                        runno: context.nrunno,
                        empno: context.empno,
                        formtype: context.nfrmno,
                        owner: context.vorgno,
                        cyear: context.cyear,
                        cyear2: context.cyear2,
                        next_approve: first.length > 0 ? first[0].VAPVNO : '',
                    },
                    data: formData,
                };
            } else {
                throw new Error('Failed to insert form'); // Throw an error to trigger rollback
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    setQuery(context: FormContext) {
        context.query = {
            NFRMNO: context.nfrmno,
            VORGNO: context.vorgno,
            CYEAR: context.cyear,
            CYEAR2: context.cyear2,
        };
    }

    async setFormNo(context: FormContext) {
        const form = await this.repo.getFormNextRunNo(context.query);
        if (form.length > 0) {
            context.nrunno = form[0].NRUNNO + 1;
        } else {
            context.nrunno = 1;
        }
    }

    async setFormValue(context: FormContext) {
        const formmst = await this.formmstService.getFormmst({
            NNO: context.nfrmno,
            VORGNO: context.vorgno,
            CYEAR: context.cyear,
        });
        
        const today = new Date();
        // Set formDate to current date with time 00:00:00
        const formDateWithZeroTime = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
        );

        return {
            NFRMNO: context.nfrmno,
            VORGNO: context.vorgno,
            CYEAR: context.cyear,
            CYEAR2: context.cyear2,
            NRUNNO: context.nrunno,
            VREQNO: context.empno,
            VINPUTER:
                context.inputempno == '' ? context.empno : context.inputempno,
            VREMARK: context.remark,
            DREQDATE: formDateWithZeroTime,
            CREQTIME: new Date().toTimeString().split(' ')[0], // HH:MM:SS
            CST: '1',
            VFORMPAGE: formmst[0].VFORMPAGE,
            VREMOTE: context.ip,
        };
    }

    async setOrganize(context: FormContext) {
        const user = await this.usersService.findEmp(context.empno);
        context.emppos = user.SPOSCODE;
        if (user.SSECCODE == '00') {
            if (user.SDEPCODE == '00') {
                context.orgno = user.SDIVCODE;
            } else {
                context.orgno = user.SDEPCODE;
            }
        } else {
            context.orgno = user.SSECCODE;
        }
    }

    async addFlow1(data: any, context: FormContext) {
        const orgTree = await this.orgTreeService.getOrgTree(
            context.orgno,
            data.VPOSNO,
            context.empno,
            context.emppos,
        );
        context.flag = 1; // หากไม่เจอตำแหน่งเช่น ใน ORGPOS ให้ไป set manager step โดยตรวจด้วย VPOSNO ของ FLOWMST ทีละ STEP
        if (orgTree) {
            context.flag = 2;
            for (const row of orgTree) {
                await this.getRepresent(row.VEMPNO, context);
                context.VAPVNO = row.VEMPNO;
                context.CSTEPST =
                    context.CSTEPSTDX <= 1 ? 1 : context.CSTEPSTDX - 1;
                context.CSTEPSTDX--;
                const flow = this.setFlow(data, context);
                await this.flowService.insertFlow(flow);
            }
        } else {
            context.VAPVNO = context.empno;
            await this.getRepresent(context.empno, context);
            context.CSTEPST = 0;
            const flow = this.setFlow(data, context);
            await this.flowService.insertFlow(flow);
        }
    }

    async addFlow2(data: any, context: FormContext) {
        const val = await this.orgPosService.getOrgPos({
            VPOSNO: data.VPOSNO,
            VORGNO: data.VAPVORGNO,
        });
        if (val.length > 0) {
            for (const row of val) {
                await this.getRepresent(row.VEMPNO, context);
                context.VAPVNO = row.VEMPNO;
                context.CSTEPST =
                    context.CSTEPSTDX <= 1 ? 1 : context.CSTEPSTDX - 1;
                context.CSTEPSTDX--;
                const flow = this.setFlow(data, context);
                await this.flowService.insertFlow(flow);
            }
        } else {
            await this.getRepresent(context.empno, context);
            context.VAPVNO = context.empno;
            context.CSTEPST = 0;
            const flow = this.setFlow(data, context);
            await this.flowService.insertFlow(flow);
        }
    }

    async getRepresent(empno: string, context: FormContext) {
        const condition = {
            NFRMNO: context.nfrmno,
            VORGNO: context.vorgno,
            CYEAR: context.cyear,
            VEMPNO: empno,
        };
        context.represent = await this.repService.getRepresent(condition);
    }

    setFlow(data: any, context: FormContext) {
        return {
            NFRMNO: context.nfrmno,
            VORGNO: context.vorgno,
            CYEAR: context.cyear,
            CYEAR2: context.cyear2,
            NRUNNO: context.nrunno,
            CSTEPNO: data.CSTEPNO,
            CSTEPNEXTNO: data.CSTEPNEXTNO,
            CSTEPST: context.CSTEPST.toString(),
            CSTART: '0',
            VPOSNO: data.VPOSNO,
            VAPVNO: context.VAPVNO,
            VREPNO: context.represent,
            CAPVSTNO: '0',
            CTYPE: data.CTYPE,
            VURL: data.VURL,
            CEXTDATA: data.CEXTDATA,
            CAPVTYPE: data.CAPVTYPE,
            CREJTYPE: data.CREJTYPE,
            CAPPLYALL: data.CAPPLYALL,
        };
    }

    async firstflow(data: any, context: FormContext) {
        const today = new Date();
        // Set formDate to current date with time 00:00:00
        const formDateWithZeroTime = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
        );
        const flow = {
            NFRMNO: context.nfrmno,
            VORGNO: context.vorgno,
            CYEAR: context.cyear,
            CYEAR2: context.cyear2,
            NRUNNO: context.nrunno,
            CSTEPNO: '--',
            CSTEPNEXTNO: data.length == 0 ? '00' : data[0].CSTEPNO,
            CSTART: '1',
            CSTEPST: '5',
            CTYPE: '0',
            VPOSNO: context.emppos,
            VAPVNO: context.empno,
            VREPNO: context.empno,
            VREALAPV: context.empno,
            CAPVSTNO: '1',
            DAPVDATE: formDateWithZeroTime,
            CAPVTIME: new Date().toTimeString().split(' ')[0],
            CAPVTYPE: '1',
            CREJTYPE: '1',
            CAPPLYALL: data.length == 0 ? '1' : data[0].CAPPLYALL,
            VURL: data.length == 0 ? '' : data[0].VURL,
            VREMARK: context.remark,
        };
        await this.flowService.insertFlow(flow);
    }

    async managerStep(context: FormContext) {
        const manager = await this.sequenceOrgService.getManager(context.empno);
        const query = {
            NFRMNO: context.nfrmno,
            VORGNO: context.vorgno,
            CYEAR: context.cyear,
            CYEAR2: context.cyear2,
            NRUNNO: context.nrunno,
            CSTART: '1',
        };
        const nextstep = await this.flowService.getFlow(query);

        const query2 = {
            NNO: context.nfrmno,
            VORGNO: context.vorgno,
            CYEAR: context.cyear,
        };
        const url = await this.formmstService.getFormmst(query2);
        if (manager.length > 0) {
            await this.getRepresent(manager[0].HEADNO, context);
            const flow = {
                NFRMNO: context.nfrmno,
                VORGNO: context.vorgno,
                CYEAR: context.cyear,
                CYEAR2: context.cyear2,
                NRUNNO: context.nrunno,
                CSTEPNO: '-1',
                CSTEPNEXTNO:
                    nextstep.length == 0 ? '00' : nextstep[0].CSTEPNEXTNO,
                CSTART: '0',
                CSTEPST: '4',
                CTYPE: '0',
                VPOSNO: null,
                VAPVNO: manager[0].HEADNO,
                VREPNO: context.represent,
                VREALAPV: null,
                CAPVSTNO: '0',
                CAPVTIME: null,
                DAPVDATE: null,
                CAPVTYPE: '1',
                CREJTYPE: '1',
                CAPPLYALL: '3',
                VURL: url[0].VFORMPAGE,
                VREMARK: null,
            };
            await this.flowService.insertFlow(flow);

            //Update creater flow for set next step to manager
            const query3 = {
                condition: {
                    NFRMNO: context.nfrmno,
                    VORGNO: context.vorgno,
                    CYEAR: context.cyear,
                    CYEAR2: context.cyear2,
                    NRUNNO: context.nrunno,
                    CSTART: '1',
                },
                CSTEPNEXTNO: '-1',
            };
            await this.flowService.updateFlow(query3);

            //Update other flow that step is not 1 for set next to after manager's step
            const query4 = {
                NFRMNO: context.nfrmno,
                VORGNO: context.vorgno,
                CYEAR: context.cyear,
                CYEAR2: context.cyear2,
                NRUNNO: context.nrunno,
            };
            await this.flowService.reAlignFlow(query4);
        }
    }

    async saveDraft(draft: string, context: FormContext) {
        const formDraft: any = {
            NFRMNO: context.nfrmno,
            VORGNO: context.vorgno,
            CYEAR: context.cyear,
            CYEAR2: context.cyear2,
            NRUNNO: context.nrunno,
        };
        await this.updateForm({ condition: formDraft, CST: draft });
        for (let i = 2; i <= 5; i++) {
            formDraft.CSTEPST = i.toString();
            const data: any = {
                CSTEPST: i == 5 ? '3' : (i - 1).toString(),
                CAPVTIME: null,
                DAPVDATE: null,
                VREALAPV: null,
                CAPVSTNO: '0',
            };
            await this.flowService.updateFlow({ condition: formDraft, ...data });
        }
    }
}
