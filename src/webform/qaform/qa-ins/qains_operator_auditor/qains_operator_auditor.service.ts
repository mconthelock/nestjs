import { Injectable } from '@nestjs/common';
import { CreateQainsOADto } from './dto/create-qains_operator_auditor.dto';
import { SearchQainsOADto } from './dto/search-qains_operator_auditor.dto';
import { UpdateQainsOADto } from './dto/update-qains_operator_auditor.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { QainsOARepository } from './qains_operator_auditor.repository';

@Injectable()
export class QainsOAService {
    constructor(private readonly repo: QainsOARepository) {}

    async setSeq(dto: SearchQainsOADto) {
        const lastSeq = await this.repo.getNextSeq(dto);
        if (lastSeq.length > 0) {
            return lastSeq[0].QOA_SEQ + 1;
        } else {
            return 1;
        }
    }

    async searchQainsOA(dto: SearchQainsOADto) {
        return this.repo.searchQainsOA(dto);
    }

    async findOne(dto: SearchQainsOADto) {
        return this.repo.findOne(dto);
    }

    async checkAuditSuccess(dto: FormDto) {
        return this.repo.checkAuditSuccess(dto);
    }

    async createQainsOA(dto: CreateQainsOADto) {
        try {
            const condition = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                QOA_TYPECODE: dto.QOA_TYPECODE,
            };
            const maxSeq = await this.setSeq(condition);
            const data = {
                ...condition,
                QOA_SEQ: maxSeq,
                QOA_EMPNO: dto.QOA_EMPNO,
            };
            await this.repo.create(data);
            return { status: true, message: 'Inserted Successfully' };
        } catch (error) {
            throw new Error(
                'Insert Qains operator and auditor ' + error.message,
            );
        }
    }

    async update(dto: UpdateQainsOADto) {
        try {
            const res = await this.repo.update(dto);
            if (res.affected === 0) {
                throw new Error('No rows updated');
            }
            return {
                status: true,
                message: 'Update Qains operator and auditor Successfully',
            };
        } catch (error) {
            throw new Error(
                'Update Qains operator and auditor ' + error.message,
            );
        }
    }

    async delete(dto: CreateQainsOADto) {
        try {
            const res = await this.repo.delete(dto);
            if (res.affected === 0) {
                throw new Error('No rows deleted');
            }
            return {
                status: true,
                message: 'Delete Qains operator and auditor Successfully',
            };
        } catch (error) {
            throw new Error(
                'Delete Qains operator and auditor ' + error.message,
            );
        }
    }
}
