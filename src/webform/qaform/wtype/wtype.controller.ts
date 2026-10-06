import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { WtypeService } from './wtype.service';

@Controller('webform/wtype')
export class WtypeController {
  constructor(private readonly wtypeService: WtypeService) {}

  @Get()
  findAll() {
    return this.wtypeService.findAll();
  }

  @Get(':tid')
  findOne(@Param('tid') tid: number) {
    return this.wtypeService.findOne(tid);
  }

  @Post('search')
  @UseTransaction('webformConnection')
  search(@Body() dto: FiltersDto) {
    return this.wtypeService.search(dto);
  }
}