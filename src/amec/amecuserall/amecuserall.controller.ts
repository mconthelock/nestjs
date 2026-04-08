import { Body, Controller, Get, Post } from '@nestjs/common';
import { AmecUserAllService } from './amecuserall.service';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('amec/userall')
export class AmecUserAllController {
    constructor(private readonly service: AmecUserAllService) {}

    @Get(':empno')
    findOne(empno: string) {
        return this.service.findEmp(empno);
    }

    @Post('search')
    @UseTransaction('datacenterConnection')
    async search(@Body() dto: FiltersDto) {
        return this.service.search(dto);
    }
}
