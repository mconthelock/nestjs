import { Controller, Post, Body } from '@nestjs/common';

import { DpmsOrdersItemService } from './orders_item.service';
import { SearchOrdersItemDto } from './dto/search-orders_item.dto';

@Controller('dpms/ordersitem')
export class DpmsOrdersItemController {
    constructor(private readonly ord: DpmsOrdersItemService) {}

    @Post('search')
    search(@Body() dto: SearchOrdersItemDto) {
        //return this.ord.search(dto);
        return null;
    }
}
