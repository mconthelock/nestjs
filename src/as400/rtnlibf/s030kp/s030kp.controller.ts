import { Controller, Get, Param } from '@nestjs/common';
import { S030kpService } from './s030kp.service';

@Controller('s030kp')
export class S030kpController {
    constructor(private readonly service: S030kpService) {}

    @Get('plHeader/:order')
    plHeader(@Param('order') order: string) {
        return this.service.plHeader(order);
    }
}
