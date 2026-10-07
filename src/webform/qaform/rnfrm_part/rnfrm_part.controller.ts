import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { RnfrmPartService } from './rnfrm_part.service';

@Controller('webform/rnfrm-part')
export class RnfrmPartController {
  constructor(private readonly rnfrmPartService: RnfrmPartService) {}

  @Get()
  findAll() {
    return this.rnfrmPartService.findAll();
  }

  @Get(':cyear2/:nrunno')
  findOne(
    @Param('cyear2') cyear2: string,
    @Param('nrunno') nrunno: number,
  ) {
    return this.rnfrmPartService.findOne(cyear2, nrunno);
  }

  @Post('search')
  @UseTransaction('webformConnection')
  search(@Body() dto: FiltersDto) {
    return this.rnfrmPartService.search(dto);
  }
}