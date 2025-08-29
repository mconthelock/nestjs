import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSARMService } from './audit_report_master.service';
import { CreateESCSARMDto } from './dto/create-audit_report_master.dto';
import { UpdateESCSARMDto } from './dto/update-audit_report_master.dto';

@Controller('audit-report-master')
export class ESCSARMController {
  constructor(private readonly ESCSARMService: ESCSARMService) {}

}
