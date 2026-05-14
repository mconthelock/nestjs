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
import { CreateStInpDto, DraftStInpDto } from './dto/create-st-inp.dto';
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
import { StInpEvaluateService } from './st-inp-evaluate.service';
import { EvaluateStInpDto } from './dto/evaluate-st-inp.dto';
import { StInpSaveDraftService } from './st-inp-saveDraft.service';
import { StInpJobAlertService } from './job/st-inp-mail-alert.service';

@Controller('stform/st-inp')
export class StInpController {
    constructor(
        private readonly stInpCreateService: StInpCreateService,
        private readonly stInpSaveDraftService: StInpSaveDraftService,
        private readonly stInpCorrectiveService: StInpCorrectiveService,
        private readonly stInpEvaluateService: StInpEvaluateService,
        private readonly stInpJobAlertService: StInpJobAlertService,
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

    @Post('saveAndAction')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(getFileUploadInterceptor('PA_IMAGE[]', true, 30))
    saveDraft(
        @Body() dto: DraftStInpDto,
        @Req() req: Request,
        @UploadedFiles() file: Express.Multer.File[],
    ) {
        const ip = getClientIP(req);
        return this.stInpSaveDraftService.saveDraft(dto, ip, file, this.path);
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
        return this.stInpCorrectiveService.setCorrectiveDetail(
            dto,
            ip,
            file,
            this.path,
        );
    }

    @Patch('setEvaluate')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    SetEvaluate(@Body() dto: EvaluateStInpDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.stInpEvaluateService.setEvaluate(dto, ip);
    }

    @Get('job/mailAlert')
    async mailAlert() {
        return this.stInpJobAlertService.alert();
    }

    @Get('job/mailAlert/:date')
    async mailAlertManual(@Param('date') date: string) {
        return this.stInpJobAlertService.alert(date);
    }

}
