import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoadLessTestService } from './load-less-test.service';
import { GetLoadLessTestDto } from './dto/get-load-less-test.dto';
import { LoadLessTestResponseDto } from './dto/load-less-test-result.dto';

@ApiTags('Machine Load Less Test')
@Controller('amecmfg/load-less-test')
export class LoadLessTestController {
    constructor(private readonly service: LoadLessTestService) {}

    @Get('result')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get load less test result from CSV file by machine and serial number' })
    @ApiResponse({ status: 200, type: LoadLessTestResponseDto })
    async getLoadLessTestResult(@Query() query: GetLoadLessTestDto): Promise<LoadLessTestResponseDto | null> {
        const [serial, order] = query.data.split(/\s*[|-]\s*/);
        return this.service.getLoadLessTestResult(serial, order);
    }
}