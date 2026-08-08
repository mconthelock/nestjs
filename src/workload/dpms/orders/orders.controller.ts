import { Controller } from '@nestjs/common';
import { DpmsOrdersService } from './orders.service';
@Controller('orders')
export class DpmsOrdersController {
    constructor(private readonly ord: DpmsOrdersService) {}
}
