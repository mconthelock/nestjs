import { Injectable } from '@nestjs/common';
import { CreateGpTphReqDto } from './dto/create-gp-tph.dto';
import { UpdateGpTphDto } from './dto/update-gp-tph.dto';
import { GpTphRepository } from './gp-tph.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class GpTphService {
    constructor(
        private readonly repo: GpTphRepository,
        private readonly formmstService: FormmstService,
        private readonly  formCreateService: FormCreateService,
    ) { }

    findAllAreas() {
        return this.repo.findAllAreas();
    }

    findAllLocations() {
        return this.repo.findAllLocations();
    }

    async create(
        dto: CreateGpTphReqDto,
        ip: string,

    ) {
        try {
            console.log('CreateGpTphReqDto:', dto);
            //ดึงข้อมูล Form Master
            const formmst =
                await this.formmstService.getFormMasterByVaname('GP-TPH');
            if (!formmst) {
                throw new Error('Form master not found for GP-TPH. Check FORMMST table.');
            }
            //สร้าง Form
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
            //ตรวจสอบผลสร้าง form
            if (!createForm?.status) {
                const errMsg =
                    createForm?.message?.message ||
                    createForm?.message ||
                    'Unlnow error';
                throw new Error(`Form creation failed: ${errMsg}`);
            }
            const form = {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };

            const data = {
                ...form,
                REQUEST_TYPE: dto.REQUEST_TYPE ? dto.REQUEST_TYPE.trim() : null,
                REQUEST_SUB_TYPE: dto.REQUEST_SUB_TYPE ? dto.REQUEST_SUB_TYPE.trim() : null,
                PURPOSE: dto.PURPOSE ? dto.PURPOSE.trim() : null,
                LONGTERM_YEARS: dto.LONGTERM_YEARS ? Number(dto.LONGTERM_YEARS) : null,
                PERMIT_START_DATE: dto.PERMIT_START_DATE ?? null,
                PERMIT_END_DATE: dto.PERMIT_END_DATE ?? null,
                HELMET_STICKER: dto.HELMET_STICKER ? dto.HELMET_STICKER.trim() : null,
                PHOTO_PERMIT_BADGE: dto.PHOTO_PERMIT_BADGE ? dto.PHOTO_PERMIT_BADGE.trim() : null
            };
            const insert = await this.repo.CreateGpTphReq(data);


            return {
                status: true,
                message: 'Form created successfully',
                data: insert
            }
        } catch (error) {
            throw error;
        }
    }
    async findOne(dto: FormDto) {
        return this.repo.findOne(dto);
    }
}
