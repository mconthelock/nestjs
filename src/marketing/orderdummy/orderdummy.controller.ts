import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderdummyService } from './orderdummy.service';
import { SearchOrderdummyDto } from './dto/search-orderdummy.dto';

@Controller('mkt/dummy')
export class OrderdummyController {
    constructor(private readonly ords: OrderdummyService) {}

    @Post('search')
    search(@Body() req: SearchOrderdummyDto) {
        return this.ords.search(req);
    }

    @Get('ordermain/:order/:item')
    getOrderMain(@Param('order') order: string, @Param('item') item: string) {
        return this.ords.getOrderMain(order, item);
    }
}
