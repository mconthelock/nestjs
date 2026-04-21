import { Controller } from '@nestjs/common';
import { OrdersDrawingService } from './orders-drawing.service';
import { CreateOrdersDrawingDto } from './dto/create-orders-drawing.dto';
import { UpdateOrdersDrawingDto } from './dto/update-orders-drawing.dto';

@Controller('escs/orders-drawing')
export class OrdersDrawingController {
    constructor(private readonly ordersDrawingService: OrdersDrawingService) {}
}
