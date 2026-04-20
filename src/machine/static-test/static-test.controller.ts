import { Controller, Get, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StaticTestService } from './static-test.service';
import { StaticTestResultDto } from './dto/static-test-result.dto';

@ApiTags('Static Test')
@Controller('production/static-test')
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
    @ApiQuery({ name: 'machine', example: '02' })
    @ApiQuery({ name: 'serial', example: '163103260178' })
    @ApiResponse({ status: 200, type: StaticTestResultDto })
    async getStaticTestResult(
        @Query('machine') machine: string,
        @Query('serial') serial: string,
    ): Promise<StaticTestResultDto | null> {
        return this.service.getStaticTestResult(machine, serial);
    }
}