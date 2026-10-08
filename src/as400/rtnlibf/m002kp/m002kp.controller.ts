import { Controller, Get, Param } from '@nestjs/common';
import { M002kpService } from './m002kp.service';

@Controller('as400/m002kp')
export class M002kpController {
    constructor(private readonly m002kpService: M002kpService) {}

    @Get(':order')
    findByOrder(@Param('order') order: string) {
        return this.m002kpService.findByOrder(order);
    }
}
