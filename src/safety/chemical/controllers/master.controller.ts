import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { MasterService } from '../services/master.service';
import {
    OwnOrgDto,
    RebuildSectionDto,
    ConfirmRebuildSectionDto,
    DisableByIdDto,
} from '../dto/master.dto';
import { RebuildService } from '../services/rebuild.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { CreateService } from '../services/create.service';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';

@Controller('safety/chemical/master')
export class MasterController {
    constructor(
        private readonly service: MasterService,
        private readonly rebuildService: RebuildService,
        private readonly createService: CreateService,
    ) {}

    @Get('active')
    getActive() {
        return this.service.getActive();
    }

    @Get('inactive')
    getInactive() {
        return this.service.getInactive();
    }

    @Post('OwnOrg')
    getOwnOrg(@Body() data: OwnOrgDto) {
        return this.service.getOwnOrg(data);
    }

    @Post('rebuild')
    getRebuildSection(@Body() data: RebuildSectionDto) {
        return this.rebuildService.getRebuildSection(data.ID);
    }

    @Patch('rebuild/confirm')
    @UseTransaction('gpreportConnection')
    confirmRebuildSection(@Body() data: ConfirmRebuildSectionDto) {
        return this.rebuildService.confirmRebuildSection(data);
    }

    @Patch('disable')
    disableMaster(@Body() data: DisableByIdDto) {
        return this.service.disableMaster(data.ID, data.USER_UPDATE);
    }

    @Post()
    @UseTransaction('gpreportConnection')
    @UseInterceptors(getFileUploadInterceptor())
    create(@Body() dto: any, @UploadedFiles() files: Express.Multer.File[]) {
        return this.createService.main(dto, files);
    }
}
