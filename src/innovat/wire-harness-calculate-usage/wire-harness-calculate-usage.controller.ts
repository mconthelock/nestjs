import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CalculateUsageDto } from './dto/calculate-usage.dto';
import { WireHarnessCalculateUsageService } from './wire-harness-calculate-usage.service';

@ApiTags('Wire Harness Calculate Usage')
@Controller('innovat/wire-harness/calculate-usage')
export class WireHarnessCalculateUsageController {
    constructor(
        private readonly service: WireHarnessCalculateUsageService,
    ) {}

    @Post('list')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Calculate usage' })
    @ApiResponse({ status: 200, description: 'Calculate usage list' })
    async list(@Body() dto: CalculateUsageDto) {
        return this.service.list(dto);
    }
}