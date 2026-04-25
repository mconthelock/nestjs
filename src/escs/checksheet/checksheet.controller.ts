import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChecksheetService } from './checksheet.service';
import { InCheckDto } from './dto/in-check.dto';
import { SaveDto } from './dto/save.dto';
import { DeleteDto } from './dto/delete.dto';
import { ChecksheetResponseDto } from './dto/response.dto';

@ApiTags('ESCS Excel Checksheet')
@Controller('checksheet')
export class ChecksheetController {
    constructor(private readonly service: ChecksheetService) {}

    /**
     * Inspector check data checksheet for ready save.
     * @author Mr.Pathanapong Sokpukeaw
     * @since 2026-04-25
     */
    @Post('in-check')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Check data before save' })
    @ApiResponse({ status: 200, type: ChecksheetResponseDto })
    async inCheck(@Body() dto: InCheckDto): Promise<ChecksheetResponseDto> {
        return this.service.inCheck(dto);
    }

    /**
     * User save data and excel file.
     * @author Mr.Pathanapong Sokpukeaw
     * @since 2026-04-25
     */
    @Post('save')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Save draft / submit / edit' })
    @ApiResponse({ status: 200, type: ChecksheetResponseDto })
    async save(@Body() dto: SaveDto): Promise<ChecksheetResponseDto> {
        return this.service.save(dto);
    }

    /**
     * Delete file sharepoint.
     * @author Mr.Pathanapong Sokpukeaw
     * @since 2026-04-25
     */
    @Post('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete file from SharePoint' })
    @ApiResponse({ status: 200, type: ChecksheetResponseDto })
    async delete(@Body() dto: DeleteDto): Promise<ChecksheetResponseDto> {
        return this.service.delete(dto);
    }
}