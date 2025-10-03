import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HistoryService } from './history.service';
import { createHistoryDto } from './dto/create.dto';

@Controller('sp/history')
export class HistoryController {
  constructor(private readonly history: HistoryService) {}

  @Post('create')
  create(@Body() createDto: createHistoryDto) {
    return this.history.create(createDto);
  }

  @Get(':no')
  findOne(@Param('no') no: string) {
    return this.history.findOne(no);
  }
}
