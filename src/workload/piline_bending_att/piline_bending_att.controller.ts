import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

import { PilineBendingAttService } from './piline_bending_att.service';
import { piline_bending_att } from 'src/common/Entities/workload/table/piline_bending_att.entity';

@Controller('workload/piline_bending_att')
export class PilineBendingAttController {
  constructor(
    private readonly pilineBendingAttService: PilineBendingAttService,
  ) {}

  @Get()
  findAll() {
    return this.pilineBendingAttService.findAll();
  }

  @Get(':idtag')
  findOne(@Param('idtag') idtag: string) {
    return this.pilineBendingAttService.findOne(idtag);
  }

  @Post('search')
  @UseTransaction('workloadConnection')
  search(@Body() dto: FiltersDto) {
    return this.pilineBendingAttService.search(dto);
  }

  @Post()
  @UseTransaction('workloadConnection')
  create(@Body() dto: piline_bending_att) {
    return this.pilineBendingAttService.create(dto);
  }
}