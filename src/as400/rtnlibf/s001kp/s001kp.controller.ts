import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { S001kpService } from './s001kp.service';

@Controller('as400/s001kp')
export class S001kpController {
    constructor(private readonly s001kpService: S001kpService) {}

    @Get('packinglist/:mfgno')
    packinglist(@Param('mfgno') mfgno: string) {
        return this.s001kpService.packinglist(mfgno);
    }
}
