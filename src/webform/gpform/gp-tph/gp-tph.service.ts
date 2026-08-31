import { BadRequestException, Injectable } from '@nestjs/common';
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
        private readonly formCreateService: FormCreateService,
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
            const areaIds = (Array.isArray(dto.AREA_ID)
                ? dto.AREA_ID
                : [dto.AREA_ID]).filter(
                (areaId) => Number.isFinite(Number(areaId)) && Number(areaId) > 0,
            );
            if (areaIds.length === 0) {
                throw new BadRequestException('AREA_ID must contain at least one area');
            }
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
                PHOTO_PERMIT_BADGE: dto.PHOTO_PERMIT_BADGE ? dto.PHOTO_PERMIT_BADGE.trim() : null,

            };
            const insert = await this.repo.CreateGpTphReq(data);


            const insertList = [];
            for (const detail of dto.DETAILS) {
                const detailData = {
                    CYEAR2: form.CYEAR2,
                    NRUNNO: form.NRUNNO,
                    SEQ_NO: Number(detail.SEQ_NO),
                    APPLICANT_TYPE: detail.APPLICANT_TYPE ?? null,
                    EMP_CODE: detail.EMP_CODE ?? null,
                    APPLICANT_NAME: detail.APPLICANT_NAME ?? null,
                    COMPANY_NAME: detail.COMPANY_NAME ?? null,
                };
                const insertedDetail = await this.repo.CreateGpTphApplicant(detailData);
                insertList.push(insertedDetail);
            }

            const insertAreaRecordList = [];
            for (const id of areaIds) {
                const areaRecordData = {
                    CYEAR2: form.CYEAR2,
                    NRUNNO: form.NRUNNO,
                    AREA_ID: id,
                };
                const insertedAreaRecord = await this.repo.CreateGpTphArearecord(areaRecordData);
                insertAreaRecordList.push(insertedAreaRecord);
            }


            return {
                status: true,
                message: 'GP-TPH Form created successfully',
                data: insert,
                details: insertList,
                areaRecords: insertAreaRecordList,
            };
        } catch (error) {
            throw error;
        }
    }

    async findOne(dto: FormDto) {
        return this.repo.findOne(dto);
    }
    async findList(dto: FormDto) {
        return this.repo.findList(dto);
    }
}
