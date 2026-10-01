import { Controller, HttpCode, HttpStatus, Body, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WireHarnessService } from './wire-harness.service';
import { CreateDrumDto } from './dto/create-drum.dto';

@ApiTags('Wire Harness')
@Controller('innovat/wire-harness')
export class WireHarnessController {
    constructor(
        private readonly service: WireHarnessService,
    ) {}

    @Get('process')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get process list' })
    @ApiResponse({ status: 200, description: 'Process list' })
    async process() {
        return this.service.process();
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

    @Post('drum-stock')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get available drum stock' })
    @ApiResponse({ status: 200, description: 'Drum stock list' })
    async drumStock(@Body() condition: FiltersDto) {
        return this.service.drumStock(condition);
    }

    @Post('create-drum')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Create drum' })
    @ApiResponse({ status: 200, description: 'Create drum success' })
    async createDrum(@Body() dto: CreateDrumDto) {
        return this.service.createDrum(dto);
    }
}