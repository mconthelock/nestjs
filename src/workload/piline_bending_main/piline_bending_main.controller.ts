import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

import { CreatePilineBendingMainDto } from './dto/create_piline_bending_main.dto';
import { PilineBendingMainService } from './piline_bending_main.service';

@Controller('workload/piline-bending-main')
export class PilineBendingMainController {
  constructor(
    private readonly pilineBendingMainService:
      PilineBendingMainService,
  ) {}

  @Get()
  findAll() {
    return this.pilineBendingMainService.findAll();
  }

  @Get(':idtag')
  findOne(@Param('idtag') idtag: string) {
    return this.pilineBendingMainService.findOne(idtag);
  }

  @Post('search')
  @UseTransaction('workloadConnection')
  search(@Body() dto: FiltersDto) {
    return this.pilineBendingMainService.search(dto);
  }

  @Post()
  @UseTransaction('workloadConnection')
  create(@Body() dto: CreatePilineBendingMainDto) {
    return this.pilineBendingMainService.create(dto);
  }
}