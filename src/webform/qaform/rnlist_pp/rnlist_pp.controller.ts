import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { RnlistPpService } from './rnlist_pp.service';

@Controller('webform/rnlist-pp')
export class RnlistPpController {
  constructor(private readonly rnlistPpService: RnlistPpService) {}

  @Get()
  findAll() {
    return this.rnlistPpService.findAll();
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
    return this.rnlistPpService.findOne(
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
    return this.rnlistPpService.search(dto);
  }
}