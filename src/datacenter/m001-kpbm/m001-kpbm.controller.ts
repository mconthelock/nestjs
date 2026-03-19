import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { M001KpbmService } from './m001-kpbm.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('datacenter/m001-kpbm')
export class M001KpbmController {
    constructor(private readonly m001KpbmService: M001KpbmService) {}
    @Get()
    findAll() {
        return this.m001KpbmService.findAll();
    }

    @Get(':order/:item/:prod')
    findOne(
        @Param('order') order: string,
        @Param('item') item: string,
        @Param('prod') prod: string,
    ) {
        return this.m001KpbmService.findOne(order, item, prod);
    }

    @Post('search')
    @UseTransaction('datacenterConnection')
    search(@Body() dto: FiltersDto) {
        return this.m001KpbmService.search(dto);
    }
}
