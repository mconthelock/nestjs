import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { SearchOrderDto } from './dto/search-orders.dto';

@Controller('escs/orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post('checkOrderPartSupply')
    checkOrderPartSupply(@Body() dto: SearchOrderDto) {
        return this.ordersService.checkOrderPartSupply(dto);
    }
}
