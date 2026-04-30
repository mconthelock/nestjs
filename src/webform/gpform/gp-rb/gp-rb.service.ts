import { Injectable } from '@nestjs/common';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateGpRbDto } from './dto/update-gp-rb.dto';
import { GpRbRepository } from './gp-rb.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';

@Injectable()
export class GpRbService {
    constructor(
        private readonly repo: GpRbRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
    ) {}

    findAll() {
        return this.repo.findAll();
    }

    async create(dto: CreateGpRbDto, ip: string) {
        try {
            const formmst =
                await this.formmstService.getFormMasterByVaname('GP-RB');
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INPUTBY,
                },
                ip,
            );
            const form = {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
            console.log('Form Master;', formmst);
 
            /*สร้างเงื่อนไขที่เลือกระหว่างแบบที่ 1 หรือ 2*/
            await this.repo.CreateStampReq({
                ...form,
                PURPOSE_ID: dto.PURPOSE_ID,
                PURPOSE_OTHER: dto.PURPOSE_OTHER,
                SPOSCODE: dto.SPOSCODE,
                NAME_STAMP: dto.NAME_STAMP,
                REMARK: dto.REMARK,
            });
            /*สร้างเงื่อนไขที่เลือกระหว่างแบบที่ 1 หรือ 2*/
            await this.repo.CreateCusStampReq({
                ...form,
                CUST_SIZE: dto.CUST_SIZE,
                QTY: dto.QTY,
                REMARK: dto.REMARK,
            });

            return {
                status: true,
                message: 'GP-RB form created successfully',
            }
        } catch (error) {
            throw new Error('Failed to ctrate GP-RB form');
        }
    }
}
