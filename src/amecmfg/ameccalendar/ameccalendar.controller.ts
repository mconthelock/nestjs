import { Controller, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AmeccalendarService } from './ameccalendar.service';

interface rangeObj {
  sdate: number;
  edate: number;
}

@ApiTags('calendar')
@Controller('calendar')
export class AmeccalendarController {
  constructor(private readonly calc: AmeccalendarService) {}

  @Post('range')
  @ApiOperation({
    summary: 'Get AMEC Calendar by specify Start date and End date',
  })
  getcalendarrange(@Body() req: rangeObj) {
    return this.calc.listCalendar(req.sdate, req.edate);
  }

  @Post('addBusinessDays')
  @ApiOperation({
    summary: 'Add Business Days to a given date',
  })
  addBusinessDays(@Body() req: { startDate: number | string | Date; days: number }) {
    return this.calc.addBusinessDays(req.startDate, req.days);
  }

}
