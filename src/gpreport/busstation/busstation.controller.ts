import { Controller, Body, Param, Get, Post } from '@nestjs/common';
import { BusstationService } from './busstation.service';

import { CreateBusstationDto } from './dto/create-busstation.dto';
import { UpdateBusstationDto } from './dto/update-busstation.dto';

@Controller('gpreport/busstop')
export class BusstationController {
  constructor(private readonly stop: BusstationService) {}

  @Get()
  findAll() {
    return this.stop.findAll();
  }

  @Post('create')
  async create(@Body() dto: CreateBusstationDto) {
    return this.stop.create(dto);
  }

  @Post('update/:id')
  async update(@Body() dto: UpdateBusstationDto, @Param('id') id: number) {
    return this.stop.update(id, dto);
  }
}
