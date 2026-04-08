import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuditReportHistoryService } from './audit_report_history.service';
import { CreateAuditReportHistoryDto } from './dto/create-audit_report_history.dto';
import { UpdateAuditReportHistoryDto } from './dto/update-audit_report_history.dto';

@Controller('audit-report-history')
export class AuditReportHistoryController {
  constructor(private readonly AuditReportHistoryService: AuditReportHistoryService) {}

 
}
