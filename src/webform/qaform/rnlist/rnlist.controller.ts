import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { RnlistService } from './rnlist.service';

@Controller('webform/rnlist')
export class RnlistController {
  constructor(private readonly rnlistService: RnlistService) {}

  @Get()
  findAll() {
    return this.rnlistService.findAll();
  }

  @Get(':nfrmno/:vorgno/:cyear/:cyear2/:nrunno/:id')
  findOne(
    @Param('nfrmno') nfrmno: number,
    @Param('vorgno') vorgno: string,
    @Param('cyear') cyear: string,
    @Param('cyear2') cyear2: string,
    @Param('nrunno') nrunno: number,
    @Param('id') id: number,
  ) {
    return this.rnlistService.findOne(
      nfrmno,
      vorgno,
      cyear,
      cyear2,
      nrunno,
      id,
    );
  }

  @Post('search')
  @UseTransaction('webformConnection')
  search(@Body() dto: FiltersDto) {
    return this.rnlistService.search(dto);
  }
}