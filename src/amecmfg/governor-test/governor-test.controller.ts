import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GovernorTestService } from './governor-test.service';
import { GetGovernorTestDto } from './dto/get-governor-test.dto';
import { GovernorTestResponseDto } from './dto/governor-test-response.dto';

@ApiTags('Machine Governor Test')
@Controller('amecmfg/governor-test')
export class GovernorTestController {
    constructor(private readonly service: GovernorTestService) {}

    @Post('car')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get CAR test result' })
    @ApiResponse({ status: 200, type: GovernorTestResponseDto })
    async getCAR(@Body() dto: GetGovernorTestDto): Promise<GovernorTestResponseDto> {
        return this.service.getCAR(dto);
    }

    @Post('ce')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get CE test result' })
    @ApiResponse({ status: 200, type: GovernorTestResponseDto })
    async getCE(@Body() dto: GetGovernorTestDto): Promise<GovernorTestResponseDto> {
        return this.service.getCE(dto);
    }

    @Post('cwt')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get CWT test result' })
    @ApiResponse({ status: 200, type: GovernorTestResponseDto })
    async getCWT(@Body() dto: GetGovernorTestDto): Promise<GovernorTestResponseDto> {
        return this.service.getCWT(dto);
    }
}