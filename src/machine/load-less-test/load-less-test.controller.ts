import { Controller, Get, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoadLessTestService } from './load-less-test.service';
import { GetLoadLessTestDto } from './dto/get-load-less-test.dto';
import { LoadLessTestResponseDto } from './dto/load-less-test-result.dto';

@ApiTags('Machine Load Less Test')
@Controller('machine/load-less-test')
export class LoadLessTestController {
    constructor(private readonly service: LoadLessTestService) {}

    /**
     * Get load less test result by machine and serial number
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-04-20
     */
    @Get('result')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get load less test result' })
    @ApiResponse({ status: 200, type: LoadLessTestResponseDto })
    async getLoadLessTestResult(
        @Query() query: GetLoadLessTestDto,
    ): Promise<LoadLessTestResponseDto | null> {
        return this.service.getLoadLessTestResult(query.machine, query.serial);
    }
}