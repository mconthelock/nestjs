import { Body, Controller, Post } from '@nestjs/common';

import { SearchRootcauseDto } from './dto/search-rootcause.dto';
import { RootcauseService } from './rootcause.service';

@Controller('mfg-edr/rootcause')
export class RootcauseController {
  constructor(
    private readonly rootcauseService: RootcauseService,
  ) {}

  @Post('search')
  search(@Body() dto: SearchRootcauseDto) {
    return this.rootcauseService.search(dto);
  }
}