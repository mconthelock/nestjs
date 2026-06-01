import { Injectable, Logger, BadRequestException, Catch } from '@nestjs/common';
import { CreateGpGarDto } from './dto/create-gp-gar.dto';
import { UpdateGpGarDto } from './dto/update-gp-gar.dto';
import { GpGarRepository } from './gp-gar-repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FlowService } from 'src/webform/flow/flow.service';

@Injectable()
export class GpGarService {
    constructor(
        private readonly repo: GpGarRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly handleFileFormService: HandleFileFormService,
        private readonly doactionService: DoactionFlowService,
        private readonly flowService: FlowService,
    ) {}

    findAll() {
        return this.repo.findAll();
    }
    async findOne(dto: FormDto) {
        return this.repo.findOne(dto);
    }
    async create(dto: CreateGpGarDto, ip: string, file: Express.Multer.File) {
        try {
            // สร้าง Form
            const formmst =
                await this.formmstService.getFormMasterByVaname('GP-GAR');
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INBY,
                },
                ip,
            );
            console.log('Form Master:', formmst);
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
                REQBY: dto.REQBY,
                INBY: dto.INBY,
                REQDATE: dto.REQDATE,
                REMARK: dto.REMARK,
                CATEGORY_CODE: dto.CATEGORY_CODE,
            };
            const form01 = {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
            const insert01 = await this.repo.CreateGpGarDto({
                ...form,
            });
            console.log(insert01);
            if (file) {
                const insert02 = await this.handleFileFormService.insertFiles(
                    {
                        ...form01,
                        FORM_TYPE: 'GP',
                        CREATEBY: dto.REQBY,
                    },
                    file,
                );
                console.log(insert02);
            }
            // throw new Error('test');
            return {
                status: true,
                message: 'GP-GAR form created successfully',
            };
            // console.log(createForm);
            // return createForm;
        } catch (error) {
            throw new Error('Failed to create GA-REQ from:' + error.message);
        }
    }

    async doaction(dto: UpdateGpGarDto, ip: string) {
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
                    CEXTDATA: '02'
                },
                VAPVNO: dto.CONTROLLER
            })

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
}

@Injectable()
export class GpService {
    constructor(
        private readonly repo: GpGarRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
    ) {}

    findAll() {
        return this.repo.findAll();
    }
    async create(dto: CreateGpGarDto, ip: string) {
        try {
            // ดึงข้อมูล Form Master
            const formmst =
                await this.formmstService.getFormMasterByVaname('GP-GAR');
            if (!formmst) {
                throw new Error(
                    'Form master not found for GP-GAR. Check FORMMST table.',
                );
            }
            // สร้าง Form
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INBY,
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
        } catch (error) {
            throw error;
        }
    }
}
