import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { QAINS_OPERATOR_AUDITOR } from 'src/common/Entities/webform/table/QAINS_OPERATOR_AUDITOR.entity';
import { CreateQainsOADto } from './dto/create-qains_operator_auditor.dto';
import { SearchQainsOADto } from './dto/search-qains_operator_auditor.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { UpdateQainsOADto } from './dto/update-qains_operator_auditor.dto';

@Injectable()
export class QainsOARepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(data: CreateQainsOADto) {
        return this.getRepository(QAINS_OPERATOR_AUDITOR).save(data);
    }

    async update(dto: UpdateQainsOADto) {
        const condition = {
            NFRMNO: dto.NFRMNO,
            VORGNO: dto.VORGNO,
            CYEAR: dto.CYEAR,
            CYEAR2: dto.CYEAR2,
            NRUNNO: dto.NRUNNO,
            QOA_TYPECODE: dto.QOA_TYPECODE,
            QOA_SEQ: dto.QOA_SEQ,
        };

        const data = {
            QOA_AUDIT: dto.QOA_AUDIT,
            QOA_RESULT: dto.QOA_RESULT,
            QOA_PERCENT: dto.QOA_PERCENT,
            QOA_GRADE: dto.QOA_GRADE,
            QOA_AUDIT_RESULT: dto.QOA_AUDIT_RESULT,
            QOA_IMPROVMENT_ACTIVITY: dto.QOA_IMPROVMENT_ACTIVITY,
            QOA_STATION: dto.QOA_STATION,
            QOA_SCORE: dto.QOA_SCORE,
        };
        return this.getRepository(QAINS_OPERATOR_AUDITOR).update(
            condition,
            data,
        );
    }

    async delete(dto: CreateQainsOADto) {
        return this.getRepository(QAINS_OPERATOR_AUDITOR).delete(dto);
    }

    async getNextSeq(dto: SearchQainsOADto) {
        return this.getRepository(QAINS_OPERATOR_AUDITOR).find({
            where: dto,
            order: {
                QOA_SEQ: 'DESC',
            },
            take: 1,
        });
    }

    async searchQainsOA(dto: SearchQainsOADto) {
        return this.getRepository(QAINS_OPERATOR_AUDITOR).find({
            where: dto,
            relations: ['QA_AUDIT', 'QOA_EMPNO_INFO', 'QA_FILES'],
            order: {
                QOA_SEQ: 'ASC',
            },
        });
    }

    async findOne(dto: SearchQainsOADto) {
        return this.getRepository(QAINS_OPERATOR_AUDITOR).findOne({
            where: dto,
            relations: ['QA_AUDIT', 'QOA_EMPNO_INFO', 'QA_FILES'],
            order: {
                QOA_SEQ: 'ASC',
            },
        });
    }

    async checkAuditSuccess(dto: FormDto) {
        const count = await this.manager
            .getRepository(QAINS_OPERATOR_AUDITOR)
            .createQueryBuilder('A')
            .select(
                'CASE WHEN SUM(CASE WHEN QOA_AUDIT = 1 THEN 1 ELSE 0 END) = COUNT(*) THEN 1 ELSE 0 END AS RES',
            )
            .where('A.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('A.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('A.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('A.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('A.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
            .andWhere('A.QOA_TYPECODE = :QOA_TYPECODE', { QOA_TYPECODE: 'ESO' })
            .getRawOne();
        return count.RES;
    }
}
