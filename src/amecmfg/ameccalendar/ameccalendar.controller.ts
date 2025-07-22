import { Controller, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AmeccalendarService } from './ameccalendar.service';

interface rangeObj {
  sdate: number;
  edate: number;
}

@ApiTags('Amec Calendar')
@Controller('calendar')
export class AmeccalendarController {
  constructor(private readonly calc: AmeccalendarService) {}

  @Post('range')
  @ApiOperation({
    summary: 'Get AMEC Calendar by specify Start date and End date',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sdate: { type: 'number', example: 20250101 },
        edate: { type: 'number', example: 20251231 },
      },
      required: ['sdate', 'edate'],
    },
  })
  getcalendarrange(@Body() req: rangeObj) {
    return this.calc.listCalendar(req.sdate, req.edate);
  }

  @Post('addWorkDays')
  @ApiOperation({
    summary: 'Add Work Days',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        startDate: {
          oneOf: [
            { type: 'string', example: '2025-07-22' },
            { type: 'number', example: 20250722 },
          ],
        },
        days: { type: 'number', example: 3 },
      },
      required: ['startDate', 'days'],
      description: 'สามารถใส่เป็น date string, number หรือ Date ได้',
    },
  })
  addWorkDays(
    @Body() req: { startDate: number | string | Date; days: number },
  ) {
    return this.calc.addWorkDays(req.startDate, req.days);
  }
}
