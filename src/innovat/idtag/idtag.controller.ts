import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CancelTagDto } from './dto/cancel-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { IdtagService } from './idtag.service';

@ApiTags('ID Tag')
@Controller('innovat/idtag')
export class IdtagController {
    constructor(
        private readonly service: IdtagService,
    ) {}

    @Post('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update ID Tag AS400' })
    @ApiResponse({ status: 200, description: 'Success' })
    updateTag(@Body() dto: UpdateTagDto) {
        return this.service.updateTag(dto);
    }

    @Post('cancel')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Cancel ID Tag AS400' })
    @ApiResponse({ status: 200, description: 'Success' })
    cancelTag(@Body() dto: CancelTagDto) {
        return this.service.cancelTag(dto);
    }
}