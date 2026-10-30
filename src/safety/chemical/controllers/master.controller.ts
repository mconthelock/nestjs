import { Body, Controller, Get, Post } from '@nestjs/common';
import { MasterService } from '../services/master.service';
import { OwnOrgDto } from '../dto/master.dto';

@Controller('safety/chemical/master')
export class MasterController {
    constructor(private readonly service: MasterService) {}

    @Get('active')
    getActive() {
        return this.service.getActive();
    }

    @Get('inactive')
    getInactive() {
        return this.service.getInactive();
    }

    @Post('OwnOrg')
    getOwnOrg(@Body() data: OwnOrgDto) {
        return this.service.getOwnOrg(data);
    }
}
