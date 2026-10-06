import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { RnsolveService } from './rnsolve.service';

@Controller('webform/rnsolve')
export class RnsolveController {
  constructor(private readonly rnsolveService: RnsolveService) {}

  @Get()
  findAll() {
    return this.rnsolveService.findAll();
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
    return this.rnsolveService.findOne(
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
    return this.rnsolveService.search(dto);
  }
}