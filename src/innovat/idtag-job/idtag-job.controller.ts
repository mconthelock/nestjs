import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdtagJobService } from './idtag-job.service';

@ApiTags('ID Tag Job')
@Controller('innovat/idtag-job')
export class IdtagJobController {
    constructor(
        private readonly service: IdtagJobService,
    ) {}

    @Post('sync-idtag')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sync ID Tag' })
    @ApiResponse({ status: 200, description: 'Sync ID Tag Success' })
    syncIdTag() {
        return this.service.syncIdTag();
    }
}