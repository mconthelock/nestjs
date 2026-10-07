import { Body, Controller, Post } from '@nestjs/common';

import { SearchRootcauseDto } from './dto/search-rootcause.dto';
import { RootcauseService } from './rootcause.service';
import { SearchProductionUnitDto } from './dto/search-production-unit.dto';

@Controller('mfg-edr/rootcause')
export class RootcauseController {
  constructor(
    private readonly rootcauseService: RootcauseService,
  ) {}

  @Post('search')
  search(@Body() dto: SearchRootcauseDto) {
    return this.rootcauseService.search(dto);
  }


  @Post('production-unit')
  getProductionUnit(@Body() dto: SearchProductionUnitDto) {
    return this.rootcauseService.getProductionUnit(
      dto.FYEAR
    );
  }
}