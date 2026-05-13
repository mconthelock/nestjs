import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    Req,
} from '@nestjs/common';
import { FinDsService } from './fin-ds.service';
import { CreateFinDDto, CreateFinDFormdto } from './dto/create-fin-d.dto';
import { UpdateFinDDto } from './dto/update-fin-d.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';

@Controller('finform/fin-ds')
export class FinDsController {
    constructor(private readonly finDsService: FinDsService) {}

    @Get()
    findAll() {
        return this.finDsService.findAll();
    }

    // ดึงรายการ Head ทั้งหมด สำหรับหน้า show
    @Get('show')
    findAllHeadForShow() {
        return this.finDsService.findAllHeadForShow();
    }

    // ดึงรายการเดียว พร้อม detail
    @Get('show/:nfrmno/:vorgno/:cyear/:nrunno')
    findOneForShow(
        @Param('nfrmno') nfrmno: string,
        @Param('vorgno') vorgno: string,
        @Param('cyear') cyear: string,
        @Param('nrunno') nrunno: string,
    ) {
        return this.finDsService.findOneForShow(
            Number(nfrmno),
            vorgno,
            cyear,
            Number(nrunno),
        );
    }

    @Post()
    @UseTransaction('webformConnection')
    @UseInterceptors(getFileUploadInterceptor('attachfile', true, 20))
    create(
        @Body() dto: CreateFinDFormdto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        return this.finDsService.create(dto, files, ip);
    }
}
