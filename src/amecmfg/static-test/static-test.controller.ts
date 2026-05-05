import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StaticTestService } from './static-test.service';
import { GetStaticTestDto } from './dto/get-static-test.dto';
import { StaticTestResponseDto } from './dto/static-test-result.dto';

@ApiTags('Machine Static Test')
@Controller('amecmfg/static-test')
export class StaticTestController {
    constructor(private readonly service: StaticTestService) {}

    @Get('result')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get static test result from CSV file by machine and serial number' })
    @ApiResponse({ status: 200, type: StaticTestResponseDto })
    async getStaticTestResult(@Query() query: GetStaticTestDto): Promise<StaticTestResponseDto | null> {
        return this.service.getStaticTestResult(query.machine, query.serial);
    }
}