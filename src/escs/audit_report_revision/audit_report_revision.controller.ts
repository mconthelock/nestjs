import { Controller, Post, Body } from '@nestjs/common';
import { AuditReportRevisionService } from './audit_report_revision.service';
import { SearchAuditReportRevisionDto } from './dto/search-audit_report_revision.dto';

@Controller('escs/audit-report-revision')
export class AuditReportRevisionController {
    constructor(
        private readonly AuditReportRevisionService: AuditReportRevisionService,
    ) {}

    @Post('getAuditReportRevision')
    async getAuditReportRevision(@Body() dto: SearchAuditReportRevisionDto) {
        return this.AuditReportRevisionService.getAuditReportRevision(dto);
    }
}
