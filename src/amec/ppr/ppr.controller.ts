import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PprService } from './ppr.service';
import { CreatePprDto } from './dto/create-ppr.dto';
import { UpdatePprDto } from './dto/update-ppr.dto';

@Controller('amec/ppr')
export class PprController {
  constructor(private readonly pprService: PprService) {}

  @Get()
  findAll() {
    return this.pprService.findAll();
  }

  @Get(':pr')
  findOne(@Param('pr') pr: string) {
    return this.pprService.findOne(pr);
  }
}
