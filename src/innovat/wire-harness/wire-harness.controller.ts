import { Controller, HttpCode, HttpStatus, Body, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WireHarnessService } from './wire-harness.service';

@ApiTags('Wire Harness')
@Controller('innovat/wire-harness')
export class WireHarnessController {
    constructor(
        private readonly service: WireHarnessService,
    ) {}

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
    async autoPlan(@Body() condition: FiltersDto) {
        return this.service.autoPlan(condition);
    }
}