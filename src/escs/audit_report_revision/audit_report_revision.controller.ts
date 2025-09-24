import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSARRService } from './audit_report_revision.service';
import { CreateESCSARRDto } from './dto/create-audit_report_revision.dto';
import { UpdateESCSARRDto } from './dto/update-audit_report_revision.dto';
import { SearchESCSARRDto } from './dto/search-audit_report_revision.dto';

@Controller('escs/audit-report-revision')
export class ESCSARRController {
  constructor(private readonly ESCSARRService: ESCSARRService) {}

  @Post('getAuditReportRevision')
  async getAuditReportRevision(@Body() dto: SearchESCSARRDto ) {
    return this.ESCSARRService.getAuditReportRevision(dto);
  }
}
