import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateNamestampdto } from './dto/update-gp-rb.dto';
import {
    GpRbRepository,
    ShowCusStampGpRbRepository,
    ShowstampGpRbRepository,
} from './gp-rb.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';

// สำหรับดึงข้อมูลแสดงในหน้า show-gp-rb by Plankton
@Injectable()
export class ShowstampGpRbService {
    private readonly logger = new Logger(ShowstampGpRbService.name);
    constructor(
        private readonly repo: ShowstampGpRbRepository,
        // private readonly showStampservice: ShowstampGpRbService,
        private readonly doactionService: DoactionFlowService,
    ) {}
    findAll() {
        return this.repo.findAll();
    }
    async findOne(dto: FormDto) {
        return this.repo.findOne(dto);
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
}

// สำหรับดึงข้อมูลแสดงในหน้า show-cus-stamp-gp-rb by Plankton
@Injectable()
export class ShowCusstampGpRbService {
    private readonly logger = new Logger(ShowCusstampGpRbService.name);
    constructor(
        private readonly repo: ShowCusStampGpRbRepository,
        // private readonly showCusstampservice: ShowCusstampGpRbService,
    ) {}
    findAll() {
        return this.repo.findAll();
    }
    findOne(dto: FormDto) {
        return this.repo.findOne(dto);
    }
}

@Injectable()
export class GpRbService {
    constructor(
        private readonly repo: GpRbRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly handleFileFormService: HandleFileFormService,
    ) {}

    findAll() {
        return this.repo.findAll();
    }
    async create(dto: CreateGpRbDto, ip: string, file: Express.Multer.File) {
        try {
            const stampFormatGroup = (dto.stampFormatGroup ?? '').trim().toLowerCase();
            const purposeId = dto.PURPOSE_ID != null ? String(dto.PURPOSE_ID).trim() : '';
            
            // ตรวจสอบว่า stampFormatGroup ได้รับค่าแล้ว // ถ้าไม่ใช่ PURPOSE_ID = 2 ต้องมี stampFormatGroup
            if (!stampFormatGroup && purposeId !== '2') {
                throw new BadRequestException(
                    // 'stampFormatGroup is required (standard or other)',
                    'stampFormatGroup is required when PURPOSE_ID is not 2'
                );
            }

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
            let insert;
            // บันทึกข้อมูล Stamp Request ตามประเภท
            if (stampFormatGroup === 'standard') {
                /*      if(!dto.PURPOSE_ID || !dto.PURPOSE_OTHER || !dto.SPOSCODE|| !dto.NAME_STAMP ) {
                    throw new BadRequestException('PURPOSE_ID and NAME_STAMP are required for standard stamp group');
                } */
                insert = await this.repo.CreateStampReq({
                    ...form,
                    PURPOSE_ID: dto.PURPOSE_ID,
                    PURPOSE_OTHER: dto.PURPOSE_OTHER,
                    SPOSCODE: dto.SPOSCODE,
                    NAME_STAMP: dto.NAME_STAMP,
                    REMARK: dto.STAMP_REMARK,
                });
                console.log(insert);
            } else if (stampFormatGroup === 'other') {
                if (!dto.QTY) {
                    throw new BadRequestException(
                        'QTY are required for other stamp group',
                    );
                }
                insert = await this.repo.CreateCusStampReq({
                    ...form,

                    QTY: dto.QTY,
                    STAMPCUS_REMARK: dto.STAMPCUS_REMARK,
                });
                insert = await this.repo.CreateStampReq({
                    ...form,
                    PURPOSE_ID: dto.PURPOSE_ID,
                    PURPOSE_OTHER: dto.PURPOSE_OTHER,
                });
                const save = await this.handleFileFormService.insertFiles(
                    {
                        ...form,
                        FORM_TYPE: 'GP',
                        CREATEBY: dto.REQBY,
                    },
                    file,
                );
                console.log(insert);
            }else if(!stampFormatGroup && purposeId === '2'){
                insert = await this.repo.CreateStampReq({
                    ...form,
                    PURPOSE_ID: dto.PURPOSE_ID,
                    SPOSCODE: dto.SPOSCODE,
                });
            }
             else {
                throw new BadRequestException(
                    `Invalid stampFormatGroup: "${stampFormatGroup}". Must be "standard" or "other"`,
                );
            }

            const save = await this.handleFileFormService.insertFiles(
                {
                    ...form,
                    FORM_TYPE: 'GP',
                    CREATEBY: dto.REQBY,
                },
                file,
            );
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
}
