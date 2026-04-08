import { Injectable } from '@nestjs/common';
import { CreateAuditReportRevisionDto } from './dto/create-audit_report_revision.dto';
import { UpdateAuditReportRevisionDto } from './dto/update-audit_report_revision.dto';
import { SearchAuditReportRevisionDto } from './dto/search-audit_report_revision.dto';
import { numberToAlphabetRevision } from 'src/common/utils/format.utils';
import { AuditReportRevisionRepository } from './audit_report_revision.repository';
import { AUDIT_REPORT_REVISION } from 'src/common/Entities/escs/table/AUDIT_REPORT_REVISION.entity';

@Injectable()
export class AuditReportRevisionService {
    constructor(private readonly repo: AuditReportRevisionRepository) {}

    async getAuditReportRevision(dto: SearchAuditReportRevisionDto) {
        return this.repo.getAuditReportRevision(dto);
    }

    async findLatestRevision(
        secid: number,
    ): Promise<AUDIT_REPORT_REVISION | null> {
        return await this.repo.findLatestRevision(secid);
    }

    async getNextRevision(secid: number): Promise<number> {
        const lastRevision = await this.repo.findLatestRevision(secid);
        return lastRevision ? lastRevision.ARR_REV + 1 : 0;
    }

    async create(dto: CreateAuditReportRevisionDto) {
        try {
            const revision = await this.getNextRevision(dto.ARR_SECID);
            const data = {
                ARR_REV: revision,
                ARR_REV_TEXT: numberToAlphabetRevision(revision),
                ...dto,
            };

            await this.repo.insert(data);
            return {
                status: true,
                message: 'Save Successfully',
                revision: revision,
            };
        } catch (error) {
            throw new Error('Insert revision Error: ' + error.message);
        }
    }
}
