import { Controller, HttpCode, HttpStatus, Body, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WireHarnessService } from './wire-harness.service';
import { GetAutoPlanDto } from './dto/get-auto-plan.dto';

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

    @Get('item')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get item list' })
    @ApiResponse({ status: 200, description: 'Item list' })
    async item() {
        return this.service.item();
    }

    @Get('production')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get production list' })
    @ApiResponse({ status: 200, description: 'Production list' })
    async production() {
        return this.service.production();
    }

    @Post('auto-plan')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get auto production plan from AutoPlan' })
    @ApiResponse({ status: 200, description: 'Auto production plan list' })
    async autoPlan(@Body() dto: GetAutoPlanDto) {
        return this.service.autoPlan(dto);
    }
}