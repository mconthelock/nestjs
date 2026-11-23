import { Body, Controller, HttpCode, HttpStatus, Ip, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CancelTagDto } from './dto/cancel-tag.dto';
import { IdtagService } from './idtag.service';

@ApiTags('ID Tag')
@Controller('innovat/idtag')
export class IdtagController {
    constructor(
        private readonly service: IdtagService,
    ) {}

    @Post('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update ID Tag to AS400' })
    @ApiResponse({ status: 200, description: 'Update ID Tag success' })
    async updateTag(@Body() dto: UpdateTagDto, @Ip() ip: string) {
        return this.service.updateTag(dto, ip);
    }

    @Post('cancel')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Cancel ID Tag from AS400' })
    @ApiResponse({ status: 200, description: 'Cancel ID Tag success' })
    async cancelTag(@Body() dto: CancelTagDto, @Ip() ip: string) {
        return this.service.cancelTag(dto, ip);
    }
}