import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Controller('sp/currency')
export class CurrencyController {
  constructor(private readonly curr: CurrencyService) {}

  @Get()
  findAll() {
    return this.curr.findAll();
  }

  @Get('period/:year/:period')
  findPeriod(@Param('year') year: string, @Param('period') period: string) {
    return this.curr.findPeriod(year, period);
  }
}
