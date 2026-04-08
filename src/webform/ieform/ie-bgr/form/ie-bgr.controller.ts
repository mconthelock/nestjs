import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    Req,
    UploadedFiles,
} from '@nestjs/common';
import { IeBgrService } from './ie-bgr.service';
import { CreateIeBgrDto, DraftIeBgrDto } from './dto/create-ie-bgr.dto';
import { ReportIeBgrDto, UpdateIeBgrDto } from './dto/update-ie-bgr.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { LastApvIeBgrDto } from './dto/lastapv-ie-bgr.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UseForceTransaction, UseTransaction } from 'src/common/decorator/transaction.decorator';
import { IeBgrCreateService } from './ie-bgr-create.service';
import { IeBgrLastApvService } from './ie-bgr-lastApv.service';
import { IeBgrDraftService } from './ie-bgr-draft.sevice';

@Controller('ieform/ie-bgr')
export class IeBgrController {
    constructor(
        private readonly ieBgrService: IeBgrService,
        private readonly ieBgrCreateService: IeBgrCreateService,
        private readonly ieBgrLastApvService: IeBgrLastApvService,
        private readonly ieBgrDraftService: IeBgrDraftService,
    ) {}

    private readonly path =
        `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/IE/IEBGR/` as string;

    @Post('create')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(
        getFileUploadInterceptor([
            { name: 'imageI[]', maxCount: 10 },
            { name: 'imageP[]', maxCount: 10 },
            { name: 'imageD[]', maxCount: 10 },
            { name: 'imageN[]', maxCount: 10 },
            { name: 'imageE[]', maxCount: 10 },
            { name: 'imageS[]', maxCount: 10 },
            { name: 'fileP[]', maxCount: 10 },
            { name: 'fileR[]', maxCount: 10 },
            { name: 'fileS[]', maxCount: 10 },
            { name: 'fileM[]', maxCount: 10 },
            { name: 'fileE[]', maxCount: 10 },
            { name: 'fileU[]', maxCount: 10 },
            { name: 'fileO[]', maxCount: 10 },
        ]),
    )
    create(
        @Body() dto: CreateIeBgrDto,
        @UploadedFiles()
        files: {
            imageI?: Express.Multer.File[];
            imageP?: Express.Multer.File[];
            imageD?: Express.Multer.File[];
            imageN?: Express.Multer.File[];
            imageE?: Express.Multer.File[];
            imageS?: Express.Multer.File[];
            fileP?: Express.Multer.File[];
            fileR?: Express.Multer.File[];
            fileS?: Express.Multer.File[];
            fileM?: Express.Multer.File[];
            fileE?: Express.Multer.File[];
            fileU?: Express.Multer.File[];
            fileO?: Express.Multer.File[];
        },
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.ieBgrCreateService.create(dto, files, ip, this.path);
    }

    @Post('draft')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(
        getFileUploadInterceptor([
            { name: 'imageI[]', maxCount: 10 },
            { name: 'imageP[]', maxCount: 10 },
            { name: 'imageD[]', maxCount: 10 },
            { name: 'imageN[]', maxCount: 10 },
            { name: 'imageE[]', maxCount: 10 },
            { name: 'imageS[]', maxCount: 10 },
            { name: 'fileP[]', maxCount: 10 },
            { name: 'fileR[]', maxCount: 10 },
            { name: 'fileS[]', maxCount: 10 },
            { name: 'fileM[]', maxCount: 10 },
            { name: 'fileE[]', maxCount: 10 },
            { name: 'fileU[]', maxCount: 10 },
            { name: 'fileO[]', maxCount: 10 },
        ]),
    )
    draft(
        @Body() dto: DraftIeBgrDto,
        @UploadedFiles()
        files: {
            imageI?: Express.Multer.File[];
            imageP?: Express.Multer.File[];
            imageD?: Express.Multer.File[];
            imageN?: Express.Multer.File[];
            imageE?: Express.Multer.File[];
            imageS?: Express.Multer.File[];
            fileP?: Express.Multer.File[];
            fileR?: Express.Multer.File[];
            fileS?: Express.Multer.File[];
            fileM?: Express.Multer.File[];
            fileE?: Express.Multer.File[];
            fileU?: Express.Multer.File[];
            fileO?: Express.Multer.File[];
        },
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.ieBgrDraftService.draft(dto, files, ip, this.path);
    }

    @Post('lastApprove')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    lastApprove(@Body() dto: LastApvIeBgrDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return this.ieBgrLastApvService.lastApprove(dto, ip);
    }

    @Post('report')
    @UseInterceptors(getFileUploadInterceptor())
    report(@Body() dto: ReportIeBgrDto) {
        return this.ieBgrService.report(dto);
    }
}
