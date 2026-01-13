import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EbgreqformService } from './ebgreqform.service';
import { CreateEbgreqformDto } from './dto/create-ebgreqform.dto';
import { UpdateEbgreqformDto } from './dto/update-ebgreqform.dto';

@Controller('ebgreqform')
export class EbgreqformController {
  constructor(private readonly ebgreqformService: EbgreqformService) {}

  @Post()
  create(@Body() createEbgreqformDto: CreateEbgreqformDto) {
    return this.ebgreqformService.create(createEbgreqformDto);
  }
}
