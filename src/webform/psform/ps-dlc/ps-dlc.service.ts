import { Injectable } from '@nestjs/common';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { CreatePsdlcReqFormDto } from './dto/create-ps-dlc.dto';
import { PSDLCRepository } from './ps-dlc.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PSDLCReportDto } from './dto/report-ps-dlc.dto';
import {
    UpdatedataPSDLCDto,
    UpdateflowPSDLCDto,
} from './dto/update-ps-dlc.dto';

@Injectable()
export class PSDLCService {
    constructor(
        private readonly repo: PSDLCRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly doactionService: DoactionFlowService,
        private readonly flowService: FlowService,
    ) {}

    async create(dto: CreatePsdlcReqFormDto, ip: string) {
        try {
            console.log(dto);

            // ดึงข้อมูล Form Master
            const formmst =
                await this.formmstService.getFormMasterByVaname('PS-DLC');
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

            const insertForm = await this.repo.createForm({
                ...form,
                CHANGE_DATE: dto.CHANGE_DATE,
                CHANGE_SCHD: dto.CHANGE_SCHD,
                CHANGE_STATUS: dto.CHANGE_STATUS,
                ACTUAL_DATE: dto.ACTUAL_DATE,
                ACTUAL_UPDATEBY: dto.ACTUAL_UPDATEBY,
            });

            const insertList = [];
            // ==========================================
            let details = [];
            if (dto.DETAILS) {
                try {
                    details =
                        typeof dto.DETAILS === 'string'
                            ? JSON.parse(dto.DETAILS)
                            : dto.DETAILS;

                    if (!Array.isArray(details)) {
                        throw new Error('DETAILS must be an array');
                    }
                } catch (error) {
                    throw new Error(
                        'Invalid DETAILS format. Must be a valid JSON array.',
                    );
                }
            }
            // ==========================================
            for (const detail of details) {
                const dataTable = {
                    ...form,
                    SEQNO: detail.SEQNO,
                    DRAWING: detail.DRAWING ?? '',
                    ITEM: detail.ITEM ?? '',
                    NEWCODE: detail.NEWCODE ?? '',
                    NEWFLAG: detail.NEWFLAG ?? '',
                    OLDCODE: detail.OLDCODE ?? '',
                    OLDFLAG: detail.OLDFLAG ?? '',
                    OLDSTATUS: detail.OLDSTATUS ?? '',
                    OLDSPEC: detail.OLDSPEC ?? '',
                    REFERENCE: detail.REFERENCE ?? '',
                    REMARK: detail.REMARKTABLE ?? detail.REMARK ?? '',
                };

                insertList.push(await this.repo.createDetails(dataTable));
            }

            return {
                status: true,
                message: 'PS-DLC form created successfully',
                data: {
                    form,
                    psdlcForm: insertForm,
                    list: insertList,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async findOne(dto: FormDto) {
        return this.repo.findOneList(dto);
    }

    async searchReport(dto: PSDLCReportDto) {
        return this.repo.search(dto);
    }

    async doaction(dto: UpdateflowPSDLCDto, ip: string) {
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

    async updateForm(dto: UpdatedataPSDLCDto, ip: string) {
        try {
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            await this.repo.updateDLCform(
                form,
                dto.CHANGE_STATUS,
                dto.ACTUAL_DATE,
                dto.ACTUAL_UPDATEBY,
            );
            const doActi0n = await this.doactionService.doAction(
                {
                    ...form,
                    EMPNO: dto.EMPNO,
                    ACTION: dto.ACTION,
                    REMARK: dto.REMARK,
                },
                ip,
            );
            if (!doActi0n.status) {
                throw new Error(doActi0n.message);
            }
            return {
                status: true,
                message: 'PS-DLC FORM updated successfully',
            };
        } catch (error) {
            throw new Error(`Failed to action: ${error.message}`);
        }
    }
}
