import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SnService } from './sn.service';
import { SearchEbudgetSnDto } from './dto/search.dto';

@Controller('ebudget/sn')
export class SnController {
  constructor(private readonly snService: SnService) {}

  @Get()
  findAll() {
    return this.snService.findAll();
  }

  @Post('getDataSn')
  async getDataSn(@Body() dto: SearchEbudgetSnDto) {
    return await this.snService.getDataSn(dto);
  }
}
