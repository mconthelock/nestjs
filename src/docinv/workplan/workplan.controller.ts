import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkplanService } from './workplan.service';

@ApiTags('Workplan')
@Controller('workplan')
export class WorkplanController {
  constructor(private readonly plan: WorkplanService) {}

  @Get('attach/project/:id')
  @ApiOperation({
    summary: 'Get AMEC Calendar by specify Start date and End date',
  })
  findAttachment(@Param('id') id: number) {
    return this.plan.findAttachment(id);
  }

  @Get('docs/year/:year')
  @ApiOperation({
    summary: 'Get AMEC Calendar by specify Start date and End date',
  })
  findDocument(@Param('year') year: number) {
    return this.plan.findDocuments(year);
  }
}
