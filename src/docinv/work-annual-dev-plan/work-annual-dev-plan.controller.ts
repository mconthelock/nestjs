import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkAnnualDevPlanService } from './work-annual-dev-plan.service';

@Controller('docinv/work-annual-dev-plan')
export class WorkAnnualDevPlanController {
  constructor(
    private readonly workAnnualDevPlanService: WorkAnnualDevPlanService,
  ) {}

  @Get()
  findAll() {
    return this.workAnnualDevPlanService.findAll();
  }

  @Get(':fyear')
  findFyear(@Param('fyear') fyear: string) {
    return this.workAnnualDevPlanService.findFyear(+fyear);
  }
}
