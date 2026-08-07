import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { OrdersItemService } from './orders_item.service';
import { CreateOrdersItemDto } from './dto/create-orders_item.dto';
import { UpdateOrdersItemDto } from './dto/update-orders_item.dto';
import { SearchOrdersItemDto } from './dto/search-orders_item.dto';

@Controller('dpms/ordersitem')
export class OrdersItemController {
    constructor(private readonly ordersItemService: OrdersItemService) {}

    @Post('search')
    search(@Body() dto: SearchOrdersItemDto) {
        return this.ordersItemService.search(dto);
    }
}
