import { Controller, Get, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StaticTestService } from './static-test.service';
import { GetStaticTestDto } from './dto/get-static-test.dto';
import { StaticTestResultDto } from './dto/static-test-result.dto';

@ApiTags('Machine Static Test')
@Controller('machine/static-test')
export class StaticTestController {
    constructor(private readonly service: StaticTestService) {}

    /**
     * Get static test result by machine and serial number
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-04-20
     */
    @Get('result')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get static test result' })
    @ApiResponse({ status: 200, type: StaticTestResultDto })
    async getStaticTestResult(
        @Query() query: GetStaticTestDto,
    ): Promise<StaticTestResultDto | null> {
        return this.service.getStaticTestResult(query.machine, query.serial);
    }
}