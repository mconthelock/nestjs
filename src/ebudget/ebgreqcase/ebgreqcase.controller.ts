import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EbgreqcaseService } from './ebgreqcase.service';
import { CreateEbgreqcaseDto } from './dto/create-ebgreqcase.dto';
import { UpdateEbgreqcaseDto } from './dto/update-ebgreqcase.dto';

@Controller('ebudget/case')
export class EbgreqcaseController {
  constructor(private readonly ebgreqcaseService: EbgreqcaseService) {}

  @Get()
  findAll() {
    return this.ebgreqcaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ebgreqcaseService.findOne(id);
  }
}
