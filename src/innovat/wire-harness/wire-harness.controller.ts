import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WireHarnessService } from './wire-harness.service';

@ApiTags('Wire Harness')
@Controller('innovat/wire-harness')
export class WireHarnessController {
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

    @Post('production-plan')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get production plan from AutoPlan' })
    @ApiResponse({ status: 200, description: 'Production plan list' })
    async productionPlan() {
        return this.service.productionPlan();
    }
}