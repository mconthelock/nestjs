import { Controller, HttpCode, HttpStatus, Body, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WireHarnessCuttingService } from './wire-harness-cutting.service';
import { CreateDrumDto } from './dto/create-drum.dto';
import { UpdateDrumDto } from './dto/update-drum.dto';
import { DrumToStockDto } from './dto/drum-to-stock.dto';

@ApiTags('Wire Harness')
@Controller('innovat/wire-harness')
export class WireHarnessCuttingController {
    constructor(
        private readonly service: WireHarnessCuttingService,
    ) {}

    @Get('process')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get process list' })
    @ApiResponse({ status: 200, description: 'Process list' })
    async process() {
        return this.service.process();
    }

    @Post('reason')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get reason list' })
    @ApiResponse({ status: 200, description: 'Reason list' })
    async reason(@Body() condition: FiltersDto) {
        return this.service.reason(condition);
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

    @Post('create-drum')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Create drum' })
    @ApiResponse({ status: 200, description: 'Create drum success' })
    async createDrum(@Body() dto: CreateDrumDto) {
        return this.service.createDrum(dto);
    }

    @Post('update-drum')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update drum' })
    @ApiResponse({ status: 200, description: 'Update drum success' })
    async updateDrum(@Body() dto: UpdateDrumDto) {
        return this.service.updateDrum(dto);
    }

    @Post('drum-to-stock')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Move drum to stock' })
    @ApiResponse({ status: 200, description: 'Move drum to stock success' })
    async drumToStock(@Body() dto: DrumToStockDto) {
        return this.service.drumToStock(dto);
    }

    @Post('drum-master')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get drum master' })
    @ApiResponse({ status: 200, description: 'Drum master list' })
    async drumMaster(@Body() condition: FiltersDto) {
        return this.service.drumMaster(condition);
    }

    @Post('reason')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get reason list' })
    @ApiResponse({ status: 200, description: 'Reason list' })
    async reason(@Body() condition: FiltersDto) {
        return this.service.reason(condition);
    }
}