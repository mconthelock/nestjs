import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateGpRbDto } from './dto/update-gp-rb.dto';
import { GpRbRepository, ShowCusStampGpRbRepository, ShowstampGpRbRepository } from './gp-rb.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';



// สำหรับดึงข้อมูลแสดงในหน้า show-gp-rb by Plankton
@Injectable()
export class ShowstampGpRbService {
    private readonly logger = new Logger(ShowstampGpRbService.name); 
    constructor(
        private readonly repo: ShowstampGpRbRepository,
    ) {}
    findAll() {
        return this.repo.findAll();
    }
    async findOne(dto: FormDto) {
        return this.repo.findOne(dto);
    }
}

// สำหรับดึงข้อมูลแสดงในหน้า show-cus-stamp-gp-rb by Plankton
@Injectable()
export class ShowCusstampGpRbService {
    private readonly logger = new Logger(ShowCusstampGpRbService.name);
    constructor(
        private readonly repo: ShowCusStampGpRbRepository,
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
            const stampFormatGroup = dto.stampFormatGroup?.toLowerCase();
            // ตรวจสอบว่า stampFormatGroup ได้รับค่าแล้ว
            if (!stampFormatGroup) {
                throw new BadRequestException('stampFormatGroup is required (standard or other)');
            }

            // ดึงข้อมูล Form Master
            const formmst = await this.formmstService.getFormMasterByVaname('GP-RB');
            if (!formmst) {
                throw new Error('Form master not found for GP-RB. Check FORMMST table.');
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
                const errMsg = createForm?.message?.message || createForm?.message || 'Unknown error';
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
               if(!dto.CUST_SIZE || !dto.QTY) {
                    throw new BadRequestException('CUST_SIZE and QTY are required for other stamp group');
                }   
                insert = await this.repo.CreateCusStampReq({
                    ...form,
                    CUST_SIZE: dto.CUST_SIZE,
                    QTY: dto.QTY,
                    STAMPCUS_REMARK: dto.STAMPCUS_REMARK,
                });
            } else {
                throw new BadRequestException(
                    `Invalid stampFormatGroup: "${stampFormatGroup}". Must be "standard" or "other"`
                );
            }

            const save = await  this.handleFileFormService.insertFiles({
                ...form,
                FORM_TYPE: "GP",
                CREATEBY: dto.REQBY,
            }, file);
            // throw new Error('test');

            return {
                status: true,
                message: 'GP-RB form created successfully',
                data: insert
            };
        } catch (error) {
            throw error;
        }
    }

}
