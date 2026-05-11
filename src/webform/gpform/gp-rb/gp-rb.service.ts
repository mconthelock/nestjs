import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateGpRbDto } from './dto/update-gp-rb.dto';
import { GpRbRepository, ShowCusStampGpRbRepository, ShowstampGpRbRepository } from './gp-rb.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';


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
}

@Injectable()
export class GpRbService {
    private readonly logger = new Logger(GpRbService.name);

    constructor(
        private readonly repo: GpRbRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
    ) {}

    findAll() {
        return this.repo.findAll();
    }
    async create(dto: CreateGpRbDto, stampFormatGroup: string, ip: string) {
        try {
            // ตรวจสอบว่า stampFormatGroup ได้รับค่าแล้ว
            if (!stampFormatGroup) {
                throw new BadRequestException('stampFormatGroup is required (standard or other)');
            }

            // ดึงข้อมูล Form Master
            const formmst = await this.formmstService.getFormMasterByVaname('GP-RB');
            if (!formmst) {
                this.logger.warn('FORMMST not found for VANAME=GP-RB');
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

            // บันทึกข้อมูล Stamp Request ตามประเภท
            if (stampFormatGroup === 'standard') {
                await this.repo.CreateStampReq({
                    ...form,
                    PURPOSE_ID: dto.PURPOSE_ID,
                    PURPOSE_OTHER: dto.PURPOSE_OTHER,
                    SPOSCODE: dto.SPOSCODE,
                    NAME_STAMP: dto.NAME_STAMP,
                    REMARK: dto.STAMP_REMARK,
                });
            } else if (stampFormatGroup === 'other') {
                await this.repo.CreateCusStampReq({
                    ...form,
                    CUST_SIZE: dto.CUST_SIZE,
                    QTY: dto.QTY,
                    REMARK: dto.STAMPCUS_REMARK,
                });
            } else {
                throw new BadRequestException(
                    `Invalid stampFormatGroup: "${stampFormatGroup}". Must be "standard" or "other"`
                );
            }

            return {
                status: true,
                message: 'GP-RB form created successfully',
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error('Error creating GP-RB form:', message);
            throw error;
        }
    }

}
