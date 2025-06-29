import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IsForm1Service } from './is-form1.service';

@ApiTags('Form1')
@Controller('form/is/is-form1')
export class IsForm1Controller {
  constructor(private readonly form1: IsForm1Service) {}

  @Get('/year/:year')
  @ApiOperation({
    summary: 'Get by year',
    description:
      'Get all annula plan that request in specific Year, Data including Work Plan/DEV/Requestor (Exclude flow Data)',
  })
  findByYear(@Param('year') year: string) {
    return this.form1.findByYear(year);
  }

  @Get('/status/:status')
  @ApiOperation({
    summary: 'Get by status',
    description: `Get all annula plan by project status, Data including:
        1.Wait for approve
        2.Running
        3.Complete
        4.Postpone
    `,
  })
  findByStatus(@Param('status') status: number) {
    return this.form1.findByStatus(status);
  }
}
