import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { GpLy01Service } from './gp-ly01.service';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('gpform/gp-ly01')
export class GpLy01Controller {
    constructor(private readonly tax: GpLy01Service) {}

    @Post('approve')
    @UseTransaction('mitsuConnection')
    approve(@Body() data: doactionFlowDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.tax.approve(data, ip);
    }
}
