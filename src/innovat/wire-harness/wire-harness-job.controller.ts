import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WireHarnessService } from './wire-harness.service';

@ApiTags('Wire Harness Job')
@Controller('innovat/wire-harness-job')
export class WireHarnessJobController {
    constructor(
        private readonly service: WireHarnessService,
    ) {}

    @Post('sync-production-plan')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sync production plan data from AS400 to Oracle' })
    @ApiResponse({ status: 200, description: 'Sync production plan success' })
    async syncProductionPlan() {
        return this.service.syncProductionPlan();
    }
}