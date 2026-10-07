import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Req,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { PurNvfRequestService } from './pur-nvf-request.service';
import { PurNvfReturnApproveService } from './pur-nvf-return-approve.service';
import { CreatePurnvfFormDto } from './purnvf_form/dto/create-purnvf_form.dto';
import {
    RequestPurnvfFormDto,
    PurnvfReturnArppoveDto,
} from './purnvf_form/dto/request-purnvf.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurnvfFormService } from './purnvf_form/purnvf_form.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
//import { PurCpmReturnAprroveService } from './pur-cpm-return-aprrove.service';
//import { PurNVFRequestService } from './pur-cpm-request.service';

@Controller('purform/pur-nvf')
export class PurNvfController {
    constructor(
        private readonly purNvfFormService: PurNvfRequestService,
        private readonly purNvfReturnFormService: PurNvfReturnApproveService,
    ) {}

    private readonly path =
        `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/PUR/PURNVF/` as string;

    @Post()
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseForceTransaction()
    @UseInterceptors(
        getFileUploadInterceptor([
            { name: 'fileCer[]', maxCount: 10 },
            { name: 'fileฺBank[]', maxCount: 10 },
            { name: 'fileChangeaddr[]', maxCount: 10 },
            { name: 'fileOther[]', maxCount: 10 },
        ]),
    )
    create(
        @Body() dto: RequestPurnvfFormDto,
        @UploadedFiles()
        files: {
            'fileCer[]'?: Express.Multer.File[];
            'fileฺBank[]'?: Express.Multer.File[];
            'fileChangeaddr[]'?: Express.Multer.File[];
            'fileOther[]'?: Express.Multer.File[];
        },
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.purNvfFormService.request(dto, files, ip, this.path);
    }

    @Patch()
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(
        getFileUploadInterceptor([
            { name: 'fileCer[]', maxCount: 10 },
            { name: 'fileBank[]', maxCount: 10 },
            { name: 'fileChangeaddr[]', maxCount: 10 },
            { name: 'fileOther[]', maxCount: 10 },
        ]),
    )
    update(
        @Body() dto: PurnvfReturnArppoveDto,
        @UploadedFiles()
        files: {
            'fileCer[]'?: Express.Multer.File[];
            'fileBank[]'?: Express.Multer.File[];
            'fileChangeaddr[]'?: Express.Multer.File[];
            'fileOther[]'?: Express.Multer.File[];
        },
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.purNvfReturnFormService.returnApprove(
            dto,
            files,
            ip,
            this.path,
        );
    }
}
