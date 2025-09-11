import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ESCSARMAService } from './audit_report_master_all.service';
import { SearchESCSARMDto } from '../audit_report_master/dto/search-audit_report_master.dto';

@Controller('escs/audit-report-master-all')
export class ESCSARMAController {
  constructor(private readonly ESCSARMAService: ESCSARMAService) {}

  @Post('getAuditReportMaster')
  async getAuditReportMaster(@Body() dto: SearchESCSARMDto) {
    return this.ESCSARMAService.getAuditReportMaster(dto);
  }
}
