import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DpmsPlMailService } from './dpms_pl_mail.service';
import { CreateDpmsPlMailDto } from './dto/create-dpms_pl_mail.dto';

@Controller('workload/dpms-pl-mail')
export class DpmsPlMailController {
  constructor(private readonly dpmsPlMailService: DpmsPlMailService) {}

  @Post()
  create(@Body() createDpmsPlMailDto: CreateDpmsPlMailDto) {
    return this.dpmsPlMailService.create(createDpmsPlMailDto);
  }

  @Get()
  findAll() {
    return this.dpmsPlMailService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dpmsPlMailService.remove(+id);
  }
}
