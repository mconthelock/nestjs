import { Controller, Post, Body } from '@nestjs/common';
import { AuditReportMasterAllService } from './audit_report_master_all.service';
import { SearchAuditReportMasterDto } from '../audit_report_master/dto/search-audit_report_master.dto';

@Controller('escs/audit-report-master-all')
export class AuditReportMasterAllController {
    constructor(
        private readonly AuditReportMasterAllService: AuditReportMasterAllService,
    ) {}

    @Post('getAuditReportMaster')
    async getAuditReportMaster(@Body() dto: SearchAuditReportMasterDto) {
        return this.AuditReportMasterAllService.getAuditReportMaster(dto);
    }
}
