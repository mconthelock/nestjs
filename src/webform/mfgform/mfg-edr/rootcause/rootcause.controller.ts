import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { RootcauseService } from './rootcause.service';

@Controller('mfg-edr/rootcause')
export class RootcauseController {
  constructor(
    private readonly rootcauseService: RootcauseService,
  ) {}

  @Get()
  findAll() {
    return this.rootcauseService.findAll();
  }

  @Get('fiscal-year/:fyear')
  findByFiscalYear(
    @Param('fyear', ParseIntPipe) fyear: number,
  ) {
    return this.rootcauseService.findByFiscalYear(fyear);
  }
}