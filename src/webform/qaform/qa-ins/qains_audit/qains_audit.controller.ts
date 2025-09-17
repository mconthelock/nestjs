import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QainsAuditService } from './qains_audit.service';
import { CreateQainsAuditDto, saveQainsAuditDto } from './dto/create-qains_audit.dto';
import { UpdateQainsAuditDto } from './dto/update-qains_audit.dto';

@Controller('qaform/qa-ins/audit')
export class QainsAuditController {
  constructor(private readonly qainsAuditService: QainsAuditService) {}

  @Post('saveAudit')
  async saveAudit(@Body() dto: saveQainsAuditDto) {
    return this.qainsAuditService.saveAudit(dto);
  }
}
