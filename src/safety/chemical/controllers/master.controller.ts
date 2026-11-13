import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { MasterService } from '../services/master.service';
import {
    OwnOrgDto,
    RebuildSectionDto,
    ConfirmRebuildSectionDto,
} from '../dto/master.dto';
import { RebuildService } from '../services/rebuild.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('safety/chemical/master')
export class MasterController {
    constructor(
        private readonly service: MasterService,
        private readonly rebuildService: RebuildService,
    ) {}

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

    @Post('rebuild')
    getRebuildSection(@Body() data: RebuildSectionDto) {
        return this.rebuildService.getRebuildSection(data.ID);
    }

    @Patch('rebuild/confirm')
    @UseTransaction('gpreportConnection')
    confirmRebuildSection(@Body() data: ConfirmRebuildSectionDto) {
        return this.rebuildService.confirmRebuildSection(data);
    }
}
