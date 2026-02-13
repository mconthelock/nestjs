import { Controller, Post, Body, Req, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { WMSService } from './wms.service';
import { WMSUserDto } from './dto/wms-user.dto';
import { WMSTempIssueDto } from './dto/wms-temp-issue.dto';

// @UseGuards(AuthGuard('jwt'))
@ApiTags('Warehouse WMS')
@Controller('warehouse/wms')
export class WMSController {
    constructor(private readonly wmsService: WMSService) {}

    /**
     * Get ship issue card
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-02-12
     */
    @Post('issue-list')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get ship issue card' })
    @ApiBody({ type: WMSUserDto })
    @ApiResponse({ status: 200, type: WMSTempIssueDto, isArray: true })
    async issueList(
        @Body() body: WMSUserDto
    ): Promise<WMSTempIssueDto[]> {
        return this.wmsService.getIssueList(body.empno);
    }
}
