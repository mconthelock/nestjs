import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { updateDto } from './dto/update.dto';

@Controller('sp/currency')
export class CurrencyController {
  constructor(private readonly curr: CurrencyService) {}

  @Get()
  findAll() {
    return this.curr.findAll();
  }

  @Get('period/:year/:period')
  findPeriod(@Param('year') year: number, @Param('period') period: number) {
    return this.curr.findPeriod(year, period);
  }

  @Post('update')
  update(@Body() updateDto: updateDto) {
    return this.curr.update(updateDto);
  }
}
