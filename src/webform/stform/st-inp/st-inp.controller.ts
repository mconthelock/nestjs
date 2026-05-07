import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
} from '@nestjs/common';
import { StInpService } from './st-inp.service';
import { CreateStInpDto } from './dto/create-st-inp.dto';
import { UpdateStInpDto } from './dto/update-st-inp.dto';
import { Request } from 'express';
import { getClientIP } from 'src/common/utils/ip.utils';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { StInpCreateService } from './st-inp-create.service';
import { StInpCorrectiveService } from './st-inp-corrective.service';
import {
    CorrectiveStInpDetailDto,
    CorrectiveStInpDto,
} from './dto/corrective-st-inp.dto';

@Controller('stform/st-inp')
export class StInpController {
    constructor(
        private readonly stInpService: StInpService,
        private readonly stInpCreateService: StInpCreateService,
        private readonly stInpCorrectiveService: StInpCorrectiveService,
    ) {}

    private readonly path = `${process.env.AMEC_FILE_PATH}${process.env.STATE}/safety/image/Patrol/`;

    @Post()
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(getFileUploadInterceptor('PA_IMAGE[]', true, 30))
    Create(
        @Body() createStInpDto: CreateStInpDto,
        @Req() req: Request,
        @UploadedFiles() file: Express.Multer.File[],
    ) {
        const ip = getClientIP(req);
        return this.stInpCreateService.create(
            createStInpDto,
            ip,
            file,
            this.path,
        );
    }

    @Post('setCorrective')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    SetCorrective(@Body() dto: CorrectiveStInpDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.stInpCorrectiveService.setCorrective(dto, ip);
    }

    @Patch('setCorrectiveDetail')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(getFileUploadInterceptor('PA_IMAGE_AFTER[]', true, 30))
    SetCorrectiveDetail(
        @Body() dto: CorrectiveStInpDetailDto,
        @Req() req: Request,
        @UploadedFiles() file: Express.Multer.File[],
    ) {
        const ip = getClientIP(req);
        return this.stInpCorrectiveService.setCorrectiveDetail(dto, ip, file, this.path);
    }
}
