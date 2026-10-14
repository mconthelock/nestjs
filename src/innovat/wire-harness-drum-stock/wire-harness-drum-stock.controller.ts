import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ScrapDrumDto } from './dto/scrap-drum.dto';
import { WireHarnessDrumStockService } from './wire-harness-drum-stock.service';

@ApiTags('Wire Harness Drum Stock')
@Controller('innovat/wire-harness/drum-stock')
export class WireHarnessDrumStockController {
    constructor(
        private readonly service: WireHarnessDrumStockService,
    ) {}

    @Post('list')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get drum stock list' })
    @ApiResponse({ status: 200, description: 'Drum stock list' })
    async list(@Body() condition: FiltersDto) {
        return this.service.list(condition);
    }

    @Post('scrap-drum')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Scrap drum' })
    @ApiResponse({ status: 200, description: 'Scrap drum success' })
    async scrapDrum(@Body() dto: ScrapDrumDto) {
        return this.service.scrapDrum(dto);
    }
}