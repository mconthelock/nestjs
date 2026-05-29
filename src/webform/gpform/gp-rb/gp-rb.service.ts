import { Injectable, Logger, BadRequestException } from '@nestjs/common';

import { GpRbRepository } from './gp-rb.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';

import { CreateStampReqFormDto } from './dto/create-gp-rb.dto';
import { UpdateNamestampdto } from './dto/update-gp-rb.dto';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { FlowProducer } from 'bullmq';
//Main service สำหรับจัดการ GP-RB form
@Injectable()
export class GpRbService {
    constructor(
        private readonly repo: GpRbRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly handleFileFormService: HandleFileFormService,
        private readonly doactionService: DoactionFlowService,
        private readonly deleteFlowStepService:DeleteFlowStepService
    ) {}

    findPurpose() {
        return this.repo.findPurpose();
    }

    findConfig() {
        return this.repo.findConfig();
    }

    async create(
        dto: CreateStampReqFormDto,
        ip: string,
        file: Express.Multer.File,
    ) {
        try {
            // ดึงข้อมูล Form Master
            const formmst =
                await this.formmstService.getFormMasterByVaname('GP-RB');
            if (!formmst) {
                throw new Error(
                    'Form master not found for GP-RB. Check FORMMST table.',
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

            const sposcode = Number(dto.SPOSCODE);
            if(!Number.isNaN(sposcode) && sposcode < 33){
                await this.deleteFlowStepService.deleteFlowStep({
                    ...form,
                        CSTEPNO: '14' //SUCHART 
                });
            }

            const data = {
                ...form,
                PURPOSE_ID: dto.PURPOSE_ID ? Number(dto.PURPOSE_ID) : null,
                PURPOSE_OTHER: dto.PURPOSE_OTHER
                    ? dto.PURPOSE_OTHER.trim()
                    : null,
                SPOSCODE: dto.SPOSCODE ? dto.SPOSCODE.trim() : null,
                NAME_STAMP: dto.NAME_STAMP ? dto.NAME_STAMP.trim() : null,
                REMARK: dto.REMARK ? dto.REMARK.trim() : null,
                REQ_TYPE: dto.REQ_TYPE ? dto.REQ_TYPE.trim() : null,
                REQ_QTY: dto.REQ_QTY ? Number(dto.REQ_QTY) : null,
            };
            const insert = await this.repo.CreateStampReq(data);


            if(file){
                const save = await this.handleFileFormService.insertFiles(
                    {
                        ...form,
                        FORM_TYPE: 'GP',
                        CREATEBY: dto.REQBY,
                    },
                    file,
                );
            }
        
       
            // throw new Error('test');

            return {
                status: true,
                message: 'GP-RB form created successfully',
                data: insert,
            };
        } catch (error) {
            throw error;
        }
    }

    async doaction(dto: UpdateNamestampdto, ip: string) {
        try {
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            // if (!dto.NAME_STAMP) {
            //     throw new BadRequestException('NAME_STAMP is required');
            // }
            const updateResult = await this.repo.updateNameStamp(
                form,
                dto.NAME_STAMP,
            );

            if (!updateResult.affected) {
                throw new BadRequestException('GP-RB stamp request not found');
            }
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
                message: 'NAME_STAMP updated successfully',
            };
        } catch (error) {
            throw new Error(`Failed to action: ${error.message}`);
        }
    }

    async findOne(dto: FormDto) {
        return this.repo.findOne(dto);
    }
}

