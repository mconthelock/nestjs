import { Controller, Get } from '@nestjs/common';
import { k089kpService } from './k089kp.service';

@Controller('as400/k089kp')
export class k089kpController {
    constructor(private readonly service: k089kpService) {}

    @Get('currency')
    async currency() {
        return this.service.currency();
    }
}
