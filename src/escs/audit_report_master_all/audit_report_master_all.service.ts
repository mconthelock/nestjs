import { Injectable } from '@nestjs/common';
import { AuditReportRevisionService } from '../audit_report_revision/audit_report_revision.service';
import { SearchAuditReportMasterDto } from '../audit_report_master/dto/search-audit_report_master.dto';
import { AuditReportMasterAllRepository } from './audit_report_master_all.repository';

@Injectable()
export class AuditReportMasterAllService {
    constructor(
        private readonly repo: AuditReportMasterAllRepository,
        private readonly auditReportRevisionService: AuditReportRevisionService,
    ) {}

    async getAuditReportMaster(dto: SearchAuditReportMasterDto) {
        const condition = { ...dto };
        if (dto.ARM_REV !== undefined) {
            condition.ARM_REV = dto.ARM_REV;
        } else {
            const lastRevision = await this.auditReportRevisionService.findLatestRevision(
                dto.ARM_SECID,
            );
            if (lastRevision != null) {
                condition.ARM_REV = lastRevision.ARR_REV;
            }
        }
        if (dto.ARM_STATUS !== undefined) {
            condition.ARM_STATUS = dto.ARM_STATUS;
        }
        if (dto.ARM_SECID !== undefined) {
            condition.ARM_SECID = dto.ARM_SECID;
        }
        return await this.repo.find(condition);
    }
}
