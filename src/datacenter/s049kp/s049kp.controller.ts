import { Controller, Get, Param } from '@nestjs/common';
import { S049kpService } from './s049kp.service';

@Controller('datacenter/s049kp')
export class S049kpController {
    constructor(private readonly s049kpService: S049kpService) {}

    @Get(':order')
    find(@Param('order') order: string) {
        return this.s049kpService.find(order);
    }
}
