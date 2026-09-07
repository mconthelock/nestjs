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
    UploadedFiles,
} from '@nestjs/common';
import { PurVmmService } from './pur-vmm.service';

import { UpdatePurVmmDto } from './dto/update-pur-vmm.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { RequestPurvmmFormDto } from './dto/request-pur-vmm.dto';

@Controller('purform/pur-vmm')
export class PurVmmController {
    constructor(private readonly purVmmService: PurVmmService) {}
    private readonly path =
        `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/PUR/PURVMM/` as string;

    @Post('create')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(
        getFileUploadInterceptor([
            { name: 'fileCer[]', maxCount: 10 },
            { name: 'fileOther[]', maxCount: 10 },
        ]),
    )
    create(
        @Body() dto: RequestPurvmmFormDto,
        @UploadedFiles()
        files: {
            'fileCer[]'?: Express.Multer.File[];
            'fileOther[]'?: Express.Multer.File[];
        },
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.purVmmService.request(dto, files, ip, this.path);
    }

    @Patch('update')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(
        getFileUploadInterceptor([
            { name: 'fileCer[]', maxCount: 10 },
            { name: 'fileOther[]', maxCount: 10 },
        ]),
    )
    update(
        @Body() dto: UpdatePurVmmDto, // หรือ RequestPurevaFormDto
        @UploadedFiles()
        files: {
            'fileCer[]'?: Express.Multer.File[];
            'fileOther[]'?: Express.Multer.File[];
        },
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.purVmmService.update(dto, files, ip, this.path);
    }

    @Patch('approve')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    approve(
        @Body() dto: UpdatePurVmmDto, // หรือ RequestPurevaFormDto
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.purVmmService.approve(dto, ip);
    }

    @Post('createauto')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    async createauto(@Body() formEva: FormDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return await this.purVmmService.createauto(formEva, ip, this.path);
    }

    // Temporary endpoint for starting purposes
    @Get('initial')
    @UseTransaction('webformConnection')
    initForm() {
        return this.purVmmService.initForm();
    }
}
