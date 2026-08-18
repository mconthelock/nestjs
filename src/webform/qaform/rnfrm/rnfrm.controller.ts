import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { RnfrmService } from './rnfrm.service';

@Controller('webform/rnfrm')
export class RnfrmController {
    constructor(private readonly rnfrmService: RnfrmService) {}

    @Get()
    findAll() {
        return this.rnfrmService.findAll();
    }

    @Get(':nfrmno/:vorgno/:cyear/:cyear2/:nrunno')
    findOne(
      @Param('nfrmno') nfrmno: number, 
      @Param('vorgno') vorgno: string, 
      @Param('cyear') cyear: string, 
      @Param('cyear2') cyear2: string, 
      @Param('nrunno') nrunno: number) {
        return this.rnfrmService.findOne(nfrmno, vorgno, cyear, cyear2, nrunno);
    }

    @Post('search')
    @UseTransaction('webformConnection')
    search(@Body() dto: FiltersDto) {
        return this.rnfrmService.search(dto);
    }
}