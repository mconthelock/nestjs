import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PcurrencyService } from './pcurrency.service';
import { CreatePcurrencyDto } from './dto/create-pcurrency.dto';
import { UpdatePcurrencyDto } from './dto/update-pcurrency.dto';

@Controller('amec/pcurrency')
export class PcurrencyController {
  constructor(private readonly pcurrencyService: PcurrencyService) {}
  @Get('currency')
  findCurrency() {
    return this.pcurrencyService.findCurrency();
  }
 
}
