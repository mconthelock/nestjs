import { Body, Controller, Get, Post } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { createSchdDto } from './dto/create.dto';
import { updateSchdDto } from './dto/update.dto';
import { searchSchdDto } from './dto/search.dto';

@Controller('hradmin/scheduler')
export class SchedulerController {
  constructor(private readonly schd: SchedulerService) {}

  @Get()
  findAll() {
    return this.schd.findAll();
  }

  @Post('search')
  search(@Body() data: searchSchdDto) {
    return this.schd.search(data);
  }

  @Post('create')
  create(@Body() data: createSchdDto) {
    return this.schd.create(data);
  }

  @Post('update')
  update(@Body() data: updateSchdDto) {
    return this.schd.update(data);
  }
}
