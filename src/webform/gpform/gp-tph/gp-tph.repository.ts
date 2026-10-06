import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { GPTPH_AREAS } from 'src/common/Entities/webform/table/GPTPH_AREAS.entity';
import { GPTPH_LOCATION } from 'src/common/Entities/webform/table/GPTPH_LOCATION.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, DeepPartial, In } from 'typeorm';
import { CreateGpTphReqDto, CreateGpTphlistApplicantDto } from './dto/create-gp-tph.dto';
import { GPTPH_REQ_HEADER } from 'src/common/Entities/webform/table/GPTPH_REQ_HEADER.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { GPTPH_APPLICANT } from 'src/common/Entities/webform/table/GPTPH_APPLICANT.entity';
import { GPTPH_AREA_RECORD } from 'src/common/Entities/webform/table/GPTPH_AREA_RECORD.entity';
import { CreateDataAreaDto } from './dto/create-data-area.dto';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';
@Injectable()
export class GpTphRepository extends BaseRepository {

    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }
    findAllAreas() {
        return this.getRepository(GPTPH_AREAS).find({
            relations: ['LOCATION']
        });
    }

    findAreasByIds(areaIds: number[]) {
        return this.getRepository(GPTPH_AREAS).findBy({
            AREA_ID: In(areaIds),
        });
    }

    async replaceSystemApproverStep(
        form: FormDto,
        stepNo: string,
        approvers: Array<{ VAPVNO: string; VREPNO: string }>,
    ) {
        await this.manager.transaction(async (manager) => {
            const flowRepository = manager.getRepository(FLOW);
            const areaOwnerSteps = await flowRepository.findBy({
                ...form,
                CSTEPNO: stepNo,
            });

            if (areaOwnerSteps.length !== 1) {
                throw new Error(
                    `GP-TPH flow must contain exactly one Area Owner step ${stepNo}`,
                );
            }

            const [areaOwnerStep] = areaOwnerSteps;
            await flowRepository.delete({ ...form, CSTEPNO: stepNo });
            await flowRepository.save(
                approvers.map((approver) => ({
                    ...areaOwnerStep,
                    ...approver,
                    CAPVTYPE: '3',
                    CAPPLYALL: '0',
                })),
            );
        });
    }
    findAllLocations() {
        return this.getRepository(GPTPH_LOCATION).find({
            relations: ['AREAS']
        });
    }
    async findOne(dto: FormDto) {
        const qb = this.manager
            .createQueryBuilder(GPTPH_REQ_HEADER, 'req')
            .leftJoinAndSelect('req.form', 'form')
            .leftJoinAndSelect('req.formmaster', 'formmst')
            .where('req.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('req.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('req.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('req.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('req.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO });
        return qb.getOne();
    }

    async findList(dto: FormDto) {
        return this.manager
            .createQueryBuilder(GPTPH_APPLICANT, 'list')
            .where('list.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('list.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
            .orderBy('list.SEQ_NO', 'ASC')
            .getMany();
    }

    findAreaRecords(dto: FormDto) {
        return this.getRepository(GPTPH_AREA_RECORD).find({
            where: { CYEAR2: dto.CYEAR2, NRUNNO: dto.NRUNNO },
            relations: ['area', 'area.LOCATION'],
        });
    }

    /* async findOneWithList(dto: FormDto) {
            const form = await this.findOne(dto);
            const list = await this.findList(dto);
            return { 
                ...form, 
                DETAILS: list,
            };
        }*/

    async CreateGpTphReq(dto: CreateGpTphReqDto) {
        return this.getRepository(GPTPH_REQ_HEADER).save(dto)
    }

    async CreateGpTphApplicant(dto: CreateGpTphlistApplicantDto) {
        return this.getRepository(GPTPH_APPLICANT).save(dto)
    }

    async CreateGpTphArearecord(dto: GPTPH_AREA_RECORD) {
        return this.getRepository(GPTPH_AREA_RECORD).save(dto)
    }

    async replaceRequest(
        form: FormDto,
        header: DeepPartial<GPTPH_REQ_HEADER>,
        details: DeepPartial<GPTPH_APPLICANT>[],
        areaIds: number[],
        formData: { REQBY?: string; INPUTBY?: string; REMARK?: string },
    ) {
        await this.getRepository(GPTPH_REQ_HEADER).update(form, header);
        await this.getRepository(FORM).update(form, {
            VREQNO: formData.REQBY,
            VINPUTER: formData.INPUTBY,
            VREMARK: formData.REMARK,
        });
        await this.getRepository(GPTPH_APPLICANT).delete({
            CYEAR2: form.CYEAR2,
            NRUNNO: form.NRUNNO,
        });
        await this.getRepository(GPTPH_AREA_RECORD).delete({
            CYEAR2: form.CYEAR2,
            NRUNNO: form.NRUNNO,
        });
        await this.getRepository(GPTPH_APPLICANT).save(details);
        await this.getRepository(GPTPH_AREA_RECORD).save(
            areaIds.map((AREA_ID) => ({
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                AREA_ID,
            })),
        );
    }

    async deleteRequest(form: FormDto) {
        await this.getRepository(GPTPH_APPLICANT).delete({
            CYEAR2: form.CYEAR2,
            NRUNNO: form.NRUNNO,
        });
        await this.getRepository(GPTPH_AREA_RECORD).delete({
            CYEAR2: form.CYEAR2,
            NRUNNO: form.NRUNNO,
        });
        await this.getRepository(GPTPH_REQ_HEADER).delete(form);
    }

    async CreateGpTphArea(dto: CreateDataAreaDto) {
        const areaRepository = this.getRepository(GPTPH_AREAS);
        const [lastArea] = await areaRepository.find({
            order: { AREA_ID: 'DESC' },
            take: 1,
        });

        return areaRepository.save({
            ...dto,
            AREA_ID: lastArea ? lastArea.AREA_ID + 1 : 1,
            AREA_STATUS: '1',
        });
    }

    findAreaById(id: number) {
        return this.getRepository(GPTPH_AREAS).findOneBy({ AREA_ID: id });
    }

    async updateArea(id: number, dto: DeepPartial<GPTPH_AREAS>) {
        const areaRepository = this.getRepository(GPTPH_AREAS);
        await areaRepository.update({ AREA_ID: id }, dto);
        return areaRepository.findOneByOrFail({ AREA_ID: id });
    }

}
