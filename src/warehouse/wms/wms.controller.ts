import { Controller, Post, Body, Req, HttpCode, HttpStatus, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { WMSService } from './wms.service';
import { WMSUserDto } from './dto/wms-user.dto';
import { WMSTempIssueDto } from './dto/wms-temp-issue.dto';
import { WMSUploadIssueDto } from './dto/wms-upload-issue.dto';
import { WMSUploadIssueResponseDto } from './dto/wms-upload-issue-response.dto';

// @UseGuards(AuthGuard('jwt'))
@ApiTags('Warehouse WMS')
@Controller('warehouse/wms')
export class WMSController {
    constructor(private readonly service: WMSService) {}

    /**
     * Get ship issue
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-02-12
     */
    @Post('issue-list')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get ship issue' })
    @ApiBody({ type: WMSUserDto })
    @ApiResponse({ status: 200, type: WMSTempIssueDto, isArray: true })
    async issueList(
        @Body() body: WMSUserDto
    ): Promise<WMSTempIssueDto[]> {
        return this.service.getIssueList(body.empno);
    }

    /**
     * Upload issue
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-02-21
     */
    @Post('upload-issue')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Upload issue' })
    @ApiBody({ type: WMSUploadIssueDto })
    @ApiResponse({ status: 200, type: WMSUploadIssueResponseDto })
    async uploadIssue(
        @Body() body: WMSUploadIssueDto,
    ): Promise<WMSUploadIssueResponseDto> {
        return this.service.uploadIssue(body);
    }
}
