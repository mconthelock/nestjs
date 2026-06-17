import { Injectable } from '@nestjs/common';
import { PsRPRepository } from './ps-rp.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { CreatePsrpReqFormDto, PsrReportDto } from './dto/create-ps-rp.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { UpdateflowPSrpDto } from './dto/update-ps-rp.dto';
import { FlowService } from 'src/webform/flow/flow.service';
import { MailService } from 'src/common/services/mail/mail.service';

@Injectable()
export class PsRPService {
    constructor(
        private readonly repo: PsRPRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly doactionService: DoactionFlowService,
        private readonly flowService: FlowService,
    ) {}

    async create(dto: CreatePsrpReqFormDto, ip: string) {
        try {
            console.log(dto);

            // ดึงข้อมูล Form Master
            const formmst =
                await this.formmstService.getFormMasterByVaname('PS-CRP');
            if (!formmst) {
                throw new Error(
                    'Form master not found for PS-RP. Check FORMMST table.',
                );
            }

            // สร้าง Form
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INPUTBY,
                    REMARK: dto.REMARK,
                },
                ip,
            );

            // ตรวจสอบผลการสร้าง Form
            if (!createForm?.status) {
                const errMsg =
                    createForm?.message?.message ||
                    createForm?.message ||
                    'Unknown error';
                throw new Error(`Form creation failed: ${errMsg}`);
            }
            const form = {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };

            // const sposcode = Number(dto.SPOSCODE);
            // if (!Number.isNaN(sposcode) && sposcode < 33) {
            //     await this.deleteFlowStepService.deleteFlowStep({
            //         ...form,
            //         CSTEPNO: '14', //SUCHART
            //     });
            // }

            const insertForm = await this.repo.CreatePSrpForm({
                ...form,
                REQ_TYPE: dto.REQ_TYPE,
                REMARK: dto.REASON,
            });

            const insertList = [];

            for (const detail of dto.DETAILS || []) {
                const dataTable = {
                    ...form,
                    LINEID: detail.LINEID,
                    PURCODE: detail.PURCODE,
                    DESCRIPTION: detail.DESCRIPTION,
                    DRAWING: detail.DRAWING,
                    ORDERNO: detail.ORDERNO,
                    ITEMNO: detail.ITEMNO,
                    ADDREESS: detail.ADDREESS,
                    RETURNTO: detail.RETURNTO,
                    QTY: detail.QTY,
                    ISSUECARD: detail.ISSUECARD,
                    ISSUESEQ: detail.ISSUESEQ,
                    PRODUCTION: detail.PRODUCTION,
                    REMARK: detail.REMARKTABLE,
                    ISSUETO: detail.ISSUETO,
                };

                insertList.push(await this.repo.CreatePSrpReqList(dataTable));
            }

            return {
                status: true,
                message: 'PS-RP form created successfully',
                data: {
                    form,
                    psrpForm: insertForm,
                    list: insertList,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async findOne(dto: FormDto) {
        return this.repo.findOneWithList(dto);
    }

    async findList(dto: FormDto) {
        return this.repo.findList(dto);
    }

    async doaction(dto: UpdateflowPSrpDto, ip: string) {
        try {
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            await this.flowService.updateFlow({
                condition: {
                    ...form,
                    CEXTDATA: '02',
                },
                VAPVNO: dto.CONTROLLER,
            });

            const doAction = await this.doactionService.doAction(
                {
                    ...form,
                    EMPNO: dto.EMPNO,
                    ACTION: dto.ACTION,
                    REMARK: dto.REMARK,
                },
                ip,
            );
            if (!doAction.status) {
                throw new Error(doAction.message);
            }
            return {
                status: true,
                message: 'Controller updated successfully',
            };
        } catch (error) {
            throw new Error(`Failed to action: ${error.message}`);
        }
    }

    async searchReport(dto: PsrReportDto) {
        return this.repo.search(dto);
    }
}
