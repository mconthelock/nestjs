import { Controller, Get, Param } from '@nestjs/common';
import { MfgFeederService } from './mfg-feeder.service';

@Controller('escs/mfg-feeder')
export class MfgFeederController {
    constructor(
        private readonly service: MfgFeederService,
    ) {}

    @Get('info/:controlNo')
    async getInfo(@Param('controlNo') controlNo: string) {
        return this.service.getInfo(controlNo);
    }
}