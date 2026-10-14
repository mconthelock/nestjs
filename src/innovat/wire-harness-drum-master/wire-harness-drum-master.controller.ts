import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { DrumMasterDto } from './dto/drum-master.dto';
import { WireHarnessDrumMasterService } from './wire-harness-drum-master.service';

@ApiTags('Wire Harness Drum Master')
@Controller('innovat/wire-harness/drum-master')
export class WireHarnessDrumMasterController {
    constructor(
        private readonly service: WireHarnessDrumMasterService,
    ) {}

    @Post('list')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get drum master list' })
    @ApiResponse({ status: 200, description: 'Drum master list' })
    async list(@Body() condition: FiltersDto) {
        return this.service.list(condition);
    }

    @Post('save')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Save drum master' })
    @ApiResponse({ status: 200, description: 'Save drum master success' })
    async save(@Body() dto: DrumMasterDto[]) {
        return this.service.save(dto);
    }
}