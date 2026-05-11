import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PullTestService } from './pull-test.service';
import { GetPullTestDto } from './dto/get-pull-test.dto';
import { PullTestResponseDto } from './dto/pull-test-response.dto';

@ApiTags('Machine Pull Through Force Test')
@Controller('amecmfg/pull-test')
export class PullTestController {
    constructor(private readonly service: PullTestService) {}

    @Post('result')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get pull through force test result' })
    @ApiResponse({ status: 200, type: PullTestResponseDto })
    async getPullTest(@Body() dto: GetPullTestDto): Promise<PullTestResponseDto> {
        return this.service.getPullTest(dto);
    }
}