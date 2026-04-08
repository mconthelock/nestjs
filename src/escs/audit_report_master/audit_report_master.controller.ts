import { Controller, Post, Body } from '@nestjs/common';
import { AuditReportMasterService } from './audit_report_master.service';
import { SaveAuditReportMasterDto } from './dto/save-audit_report_master.dto';
import { SearchAuditReportMasterDto } from './dto/search-audit_report_master.dto';

@Controller('escs/audit-report-master')
export class AuditReportMasterController {
    constructor(
        private readonly AuditReportMasterService: AuditReportMasterService,
    ) {}

    @Post('getAuditReportMaster')
    async getAuditReportMaster(@Body() dto: SearchAuditReportMasterDto) {
        return this.AuditReportMasterService.getAuditReportMaster(dto);
    }

    @Post('save')
    async saveAuditReportMaster(@Body() dto: SaveAuditReportMasterDto) {
        return this.AuditReportMasterService.saveAuditReportMaster(dto);
    }
}
