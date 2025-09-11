import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSARHService } from './audit_report_history.service';
import { CreateESCSARHDto } from './dto/create-audit_report_history.dto';
import { UpdateESCSARHDto } from './dto/update-audit_report_history.dto';

@Controller('audit-report-history')
export class ESCSARHController {
  constructor(private readonly eSCSARHService: ESCSARHService) {}

 
}
