import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WtypeSecpicService } from './wtype_secpic.service';

@Controller('webform/wtype-secpic')
export class WtypeSecpicController {
  constructor(
    private readonly wtypeSecpicService: WtypeSecpicService,
  ) {}

  @Get()
  findAll() {
    return this.wtypeSecpicService.findAll();
  }

  @Get('sections/:tid')
  findSectionsByWtype(
    @Param('tid') tid: number,
  ) {
    return this.wtypeSecpicService.findSectionsByWtype(tid);
  }

  @Get(':tid/:secid')
  findOne(
    @Param('tid') tid: number,
    @Param('secid') secid: number,
  ) {
    return this.wtypeSecpicService.findOne(tid, secid);
  }

  @Post('search')
  @UseTransaction('webformConnection')
  search(@Body() dto: FiltersDto) {
    return this.wtypeSecpicService.search(dto);
  }


}