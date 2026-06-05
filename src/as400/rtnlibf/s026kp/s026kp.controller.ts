import { Controller, Get, Param } from '@nestjs/common';
import { S026kpService } from './s026kp.service';

@Controller('as400/s026kp')
export class S026kpController {
    constructor(private readonly service: S026kpService) {}

    @Get('shippingMark/:projno')
    shippingMark(@Param('projno') projno: string) {
        return this.service.shippingMark(projno);
    }
}
