import { Controller, Get, Param, Query } from '@nestjs/common';
import { M001kpService } from './m001kp.service';

@Controller('as400/m001kp')
export class M001kpController {
    constructor(private readonly m001kpService: M001kpService) {}

    @Get('drawing/:drawing')
    findOrdersByDrawing(
        @Param('drawing') drawing: string,
        @Query('qty') qty: string,
        @Query('variable') variable?: string,
    ) {
        return this.m001kpService.findOrdersByDrawing(drawing, qty, variable);
    }

    @Get(':order')
    findByOrder(@Param('order') order: string) {
        return this.m001kpService.findByOrder(order);
    }
}
