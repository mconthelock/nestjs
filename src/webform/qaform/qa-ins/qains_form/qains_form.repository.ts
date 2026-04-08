import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { QAINS_FORM } from 'src/common/Entities/webform/table/QAINS_FORM.entity';
import { SearchQainsFormDto } from './dto/search-qains_form.dto';
import { UpdateQainsFormDto } from './dto/update-qains_form.dto';
import { CreateQainsFormDto } from './dto/create-qains_form.dto';

@Injectable()
export class QainsFormRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getFormData(dto: FormDto) {
        return this.getRepository(QAINS_FORM).findOne({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            },
            relations: [
                'QA_INCHARGE_INFO',
                'QA_INCHARGE_SECTION_INFO',
                'QA_REV_INFO',
                'FORM',
            ],
        });
    }

    async search(dto: SearchQainsFormDto) {
        return this.getRepository(QAINS_FORM).find({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                QA_ITEM: dto.QA_ITEM,
                QA_INCHARGE_SECTION: dto.QA_INCHARGE_SECTION,
                QA_INCHARGE_EMPNO: dto.QA_INCHARGE_EMPNO,
            },
            relations: [
                'QA_AUD_OPT',
                'QA_AUD_OPT.TYPE',
                'QA_AUD_OPT.QOA_EMPNO_INFO',
                'QA_FILES',
                'QA_FILES.TYPE',
                'QA_INCHARGE_INFO',
                'QA_INCHARGE_SECTION_INFO',
            ],
            order: {
                QA_AUD_OPT: { QOA_SEQ: 'ASC' }, // แทน ORDER BY ใน subquery เดิม
                QA_FILES: { FILE_ID: 'ASC' },
            },
        });
    }

    async update(dto: UpdateQainsFormDto) {
        const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, ...data } = dto;
        const condition = { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO };
        return this.getRepository(QAINS_FORM).update(condition, data);
    }

    async create(dto: UpdateQainsFormDto) {
        return this.getRepository(QAINS_FORM).save(dto);
    }
}
