import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { RnwasteService } from './rnwaste.service';

@Controller('webform/rnwaste')
export class RnwasteController {
  constructor(private readonly rnwasteService: RnwasteService) {}

  @Get()
  findAll() {
    return this.rnwasteService.findAll();
  }

  @Get(':wid')
  findOne(@Param('wid') wid: number) {
    return this.rnwasteService.findOne(wid);
  }

  @Post('search')
  @UseTransaction('webformConnection')
  search(@Body() dto: FiltersDto) {
    return this.rnwasteService.search(dto);
  }
}