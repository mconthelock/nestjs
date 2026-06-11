import { Controller, Get, Param } from '@nestjs/common';
import { S020kpService } from './s020kp.service';

@Controller('datacenter/s020kp')
export class S020kpController {
    constructor(private readonly s020kpService: S020kpService) {}

    @Get(':order')
    find(@Param('order') order: string) {
        return this.s020kpService.find(order);
    }
}
