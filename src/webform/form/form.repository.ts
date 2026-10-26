import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FormWebformDto, GetNextRunNoDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { formDetailQb, formatFormDetail } from 'src/common/utils/qb-form-detail';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';

@Injectable()
export class FormRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from Form`);
        // return this.getRepository(Form).find();
        return this.manager.find(FORM);
    }

    findOne(dto: FormDto) {
        return this.getRepository(FORM).findOne({
            where: dto,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(FORM, 'F');
        this.applyFilters(qb, 'F', dto, [
            'NFRMNO',
            'VORGNO',
            'CYEAR',
            'CYEAR2',
            'NRUNNO',
        ]);
        return qb.getMany();
    }

    async create(dto: FormWebformDto): Promise<FORM> {
        return this.getRepository(FORM).save(dto);
    }

    async update(form: FormDto, dto: UpdateFormDto) {
        return this.getRepository(FORM).update(form, dto);
    }

    async deleteForm(form: FormDto) {
        return this.getRepository(FORM).delete(form);
    }

    async getFormNextRunNo(dto: GetNextRunNoDto) {
        return this.getRepository(FORM).find({
            where: dto,
            order: {
                NRUNNO: 'DESC',
            },
            take: 1,
        });
    }

    async getCst(form: FormDto) {
        return await this.getRepository(FORM).findOne({
            where: {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
            },
            select: {
                CST: true,
            },
        });
    }

    async getFormDetail(form: FormDto) {
        const query = formDetailQb(this.manager.connection);
        const formDetail = await query
            .where('F.NFRMNO = :NFRMNO', { NFRMNO: form.NFRMNO })
            .andWhere('F.VORGNO = :VORGNO', { VORGNO: form.VORGNO })
            .andWhere('F.CYEAR = :CYEAR', { CYEAR: form.CYEAR })
            .andWhere('F.CYEAR2 = :CYEAR2', { CYEAR2: form.CYEAR2 })
            .andWhere('F.NRUNNO = :NRUNNO', { NRUNNO: form.NRUNNO })
            .getRawOne();
        return formatFormDetail(formDetail);
    }

    async getFormData(form: FormDto) {
        const row = await this.manager
            .createQueryBuilder()
            .select([
                'F.*',
                'C.VANAME AS VANAME',
                'A.SNAME AS VREQNAME',
                'B.SNAME AS VINPUTNAME',
            ])
            .from('FORM', 'F')
            .innerJoin('AMECUSERALL', 'A', 'A.SEMPNO = F.VREQNO')
            .innerJoin('AMECUSERALL', 'B', 'B.SEMPNO = F.VINPUTER')
            .innerJoin(
                'FORMMST',
                'C',
                'C.NNO = F.NFRMNO AND C.VORGNO = F.VORGNO AND C.CYEAR = F.CYEAR',
            )
            .where('F.NFRMNO = :NFRMNO', { NFRMNO: form.NFRMNO })
            .andWhere('F.VORGNO = :VORGNO', { VORGNO: form.VORGNO })
            .andWhere('F.CYEAR = :CYEAR', { CYEAR: form.CYEAR })
            .andWhere('F.CYEAR2 = :CYEAR2', { CYEAR2: form.CYEAR2 })
            .andWhere('F.NRUNNO = :NRUNNO', { NRUNNO: form.NRUNNO })
            .getRawOne();

        if (!row) return row;
        const year2 = String(row.CYEAR2 ?? '').slice(2, 4);
        const runNo = String(row.NRUNNO ?? '').padStart(6, '0');
        return {
            ...row,
            FORMNO: `${row.VANAME ?? ''}${year2}-${runNo}`,
        };
    }
}
