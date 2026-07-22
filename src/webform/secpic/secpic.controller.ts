import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { SecpicService } from './secpic.service';

@Controller('webform/secpic')
export class SecpicController {
  constructor(private readonly secpicService: SecpicService) {}

  @Get()
  findAll() {
    return this.secpicService.findAll();
  }

  @Get(':secid')
  findOne(@Param('secid') secid: number) {
    return this.secpicService.findOne(secid);
  }

  @Post('search')
  @UseTransaction('webformConnection')
  search(@Body() dto: FiltersDto) {
    return this.secpicService.search(dto);
  }
}