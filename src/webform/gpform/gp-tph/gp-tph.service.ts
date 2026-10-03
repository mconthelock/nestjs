import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateGpTphReqDto } from './dto/create-gp-tph.dto';
import { UpdateGpTphDto } from './dto/update-gp-tph.dto';
import { GpTphRepository } from './gp-tph.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { CreateDataAreaDto } from './dto/create-data-area.dto';
import { UpdateAreaDto } from './dto/update-data-area.dto';
import { FlowmstService } from 'src/webform/flowmst/flowmst.service';
import { OrgposService } from 'src/webform/orgpos/orgpos.service';
import { RepService } from 'src/webform/rep/rep.service';

@Injectable()
export class GpTphService {
    constructor(
        private readonly repo: GpTphRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly flowmstService: FlowmstService,
        private readonly orgposService: OrgposService,
        private readonly repService: RepService,
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
            const [flowMaster, areaOwnerApprovers] = await Promise.all([
                this.flowmstService.getFlowMaster(
                    formmst.NNO,
                    formmst.VORGNO,
                    formmst.CYEAR,
                ),
                this.getAreaOwnerApprovers(areaIds, formmst),
            ]);
            const areaOwnerSteps = flowMaster.filter(
                (step) =>
                    step.VAPVNO?.trim() === 'SYSTEM' &&
                    step.CEXTDATA?.trim() === '01',
            );
            if (areaOwnerSteps.length !== 1) {
                throw new BadRequestException(
                    'GP-TPH flow must contain exactly one SYSTEM Area Owner step with CEXTDATA 01',
                );
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
            await this.repo.replaceSystemApproverStep(
                form,
                areaOwnerSteps[0].CSTEPNO,
                areaOwnerApprovers,
            );

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

    private async getAreaOwnerApprovers(
        areaIds: number[],
        formmst: { NNO: number; VORGNO: string; CYEAR: string },
    ) {
        const areas = await this.repo.findAreasByIds(areaIds);
        const areasById = new Map(
            areas.map((area) => [Number(area.AREA_ID), area]),
        );
        const missingAreaIds = areaIds.filter((areaId) => !areasById.has(areaId));
        if (missingAreaIds.length > 0) {
            throw new BadRequestException(
                `Selected area IDs do not exist: ${missingAreaIds.join(', ')}`,
            );
        }

        const ownerEmployees = new Set<string>();
        for (const areaId of areaIds) {
            const area = areasById.get(areaId);
            const positionCode = area.AREA_OWNER_POSCODE?.trim();
            const organizationCode = area.AREA_OWNER?.trim();
            if (!positionCode || !organizationCode) {
                throw new BadRequestException(
                    `Area "${area.AREA_NAME}" has an invalid Area Owner assignment`,
                );
            }

            const employees = await this.orgposService.getOrgPos({
                VPOSNO: positionCode,
                VORGNO: organizationCode,
            });
            if (employees.length === 0) {
                throw new BadRequestException(
                    `Area "${area.AREA_NAME}" has no active Area Owner`,
                );
            }

            employees.forEach((employee) => ownerEmployees.add(employee.VEMPNO));
        }

        return Promise.all(
            [...ownerEmployees].map(async (VAPVNO) => ({
                VAPVNO,
                VREPNO: await this.repService.getRepresent({
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    VEMPNO: VAPVNO,
                }),
            })),
        );
    }
    async createArea(dto: CreateDataAreaDto) {
        return this.repo.CreateGpTphArea(this.normalizeArea(dto));
    }

    async update(form: FormDto, dto: UpdateGpTphDto) {
        const existing = await this.repo.findOne(form);
        if (!existing) {
            throw new NotFoundException('GP-TPH request was not found');
        }

        const areaIds = (Array.isArray(dto.AREA_ID) ? dto.AREA_ID : [dto.AREA_ID])
            .filter((areaId) => Number.isFinite(Number(areaId)) && Number(areaId) > 0)
            .map(Number);
        if (!areaIds.length) {
            throw new BadRequestException('AREA_ID must contain at least one area');
        }
        if (!Array.isArray(dto.DETAILS) || !dto.DETAILS.length) {
            throw new BadRequestException('DETAILS must contain at least one applicant');
        }

        const header = {
            REQUEST_TYPE: dto.REQUEST_TYPE?.trim() ?? null,
            REQUEST_SUB_TYPE: dto.REQUEST_SUB_TYPE?.trim() ?? null,
            PURPOSE: dto.PURPOSE?.trim() ?? null,
            LONGTERM_YEARS:
                dto.LONGTERM_YEARS === undefined || dto.LONGTERM_YEARS === null
                    ? null
                    : Number(dto.LONGTERM_YEARS),
            PERMIT_START_DATE: dto.PERMIT_START_DATE ?? null,
            PERMIT_END_DATE: dto.PERMIT_END_DATE ?? null,
            HELMET_STICKER: dto.HELMET_STICKER?.trim() ?? null,
            PHOTO_PERMIT_BADGE: dto.PHOTO_PERMIT_BADGE?.trim() ?? null,
        };
        const details = dto.DETAILS.map((detail, index) => ({
            CYEAR2: form.CYEAR2,
            NRUNNO: form.NRUNNO,
            SEQ_NO: Number(detail.SEQ_NO ?? index + 1),
            APPLICANT_TYPE: detail.APPLICANT_TYPE ?? null,
            EMP_CODE: detail.EMP_CODE ?? null,
            APPLICANT_NAME: detail.APPLICANT_NAME ?? null,
            COMPANY_NAME: detail.COMPANY_NAME ?? null,
        }));

        await this.repo.replaceRequest(form, header, details, areaIds, {
            REQBY: dto.REQBY,
            INPUTBY: dto.INPUTBY,
            REMARK: dto.REMARK,
        });
        return { status: true, message: 'GP-TPH Form updated successfully' };
    }

    async delete(form: FormDto) {
        const existing = await this.repo.findOne(form);
        if (!existing) {
            throw new NotFoundException('GP-TPH request was not found');
        }

        await this.repo.deleteRequest(form);
        const result = await this.formCreateService.deleteFlowAndForm(form);

        return {
            status: result.status,
            message: result.status
                ? 'GP-TPH Form deleted successfully'
                : 'Failed to delete GP-TPH Form',
        };
    }

    async updateArea(id: number, dto: UpdateAreaDto) {
        const area = await this.repo.findAreaById(id);
        if (!area) {
            throw new NotFoundException(`Area ${id} was not found`);
        }

        const data = this.normalizeArea(dto);
        if (Object.keys(data).length === 0) {
            throw new BadRequestException('Provide at least one area field to update');
        }

        return this.repo.updateArea(id, data);
    }

    async deleteArea(id: number) {
        const area = await this.repo.findAreaById(id);
        if (!area) {
            throw new NotFoundException(`Area ${id} was not found`);
        }

        if (await this.repo.countAreaRecords(id)) {
            throw new ConflictException(
                'This area cannot be deleted because it is assigned to a GP-TPH request',
            );
        }

        await this.repo.deleteArea(id);
        return { status: true, message: 'Area deleted successfully' };
    }

    private normalizeArea(dto: CreateDataAreaDto | UpdateAreaDto) {
        const data = { ...dto };

        if (data.AREA_NAME !== undefined) {
            data.AREA_NAME = data.AREA_NAME.trim();
        }

        if (data.AREA_OWNER === undefined) {
            return data;
        }

        const ownerValue = data.AREA_OWNER.trim();
        const [posCode, ownerCode, ...extraParts] =
            ownerValue?.split('+').map((part) => part.trim()) ?? [];

        if (!posCode || !ownerCode || extraParts.length > 0) {
            throw new BadRequestException(
                'AREA_OWNER must have the format SPOSCODE+SDEPCODE/SDIVCODE',
            );
        }

        if (posCode.length > 3 || ownerCode.length > 6) {
            throw new BadRequestException(
                'AREA_OWNER contains an invalid SPOSCODE or SDEPCODE/SDIVCODE length',
            );
        }

        // The UI submits the owner selection as "SPOSCODE+SDEPCODE/SDIVCODE".
        // Store its two parts in the columns used by GPTPH_AREAS.
        data.AREA_OWNER = ownerCode;
        data.AREA_OWNER_POSCODE = posCode;
        return data;
    }
    async findOne(dto: FormDto) {
        const request = await this.repo.findOne(dto);
        if (!request) {
            return null;
        }
        const [details, areaRecords] = await Promise.all([
            this.repo.findList(dto),
            this.repo.findAreaRecords(dto),
        ]);
        return { ...request, DETAILS: details, AREA_RECORDS: areaRecords };
    }
    async findList(dto: FormDto) {
        return this.repo.findList(dto);
    }
}
