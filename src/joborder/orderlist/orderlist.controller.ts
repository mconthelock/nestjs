import {
    Controller,
    Post,
    Body,
} from '@nestjs/common';
import { OrderListService } from './orderlist.service';
import { SearchOrderListDto } from './dto/search-orderlist.dto';

// @UseGuards(AuthGuard('jwt')) // ต้อง login เพื่อได้ cookie ถึงจะมีสิทธิ์เรียกใช้  ถ้าไม่ใช้ @UseGuards จะไม่ต้อง login ก็ได้ แต่จะไม่มีการตรวจสอบสิทธิ์
@Controller('joborder')
export class OrderListController {
    constructor(
        private readonly OrderListService: OrderListService,
    ) {}

    @Post('orderlistNew')
    async orderlistNew(@Body() dto: SearchOrderListDto) {
        const orderList = await this.OrderListService.orderlistNew(dto);
        return orderList;
    }

    @Post('orderlist/confirm')
    async confirm(@Body() dto: SearchOrderListDto) {
        const orderList = await this.OrderListService.confirm(dto);
        return orderList;
    }

    @Post('orderlist/shipment')
    async shipment(@Body() dto: SearchOrderListDto) {
        const orderList = await this.OrderListService.shipment(dto);
        return orderList;
    }
}
