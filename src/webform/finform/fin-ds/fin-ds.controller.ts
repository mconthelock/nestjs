import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseInterceptors,
    UploadedFiles,
    Req,
    Res,
    NotFoundException,
} from '@nestjs/common';

import { FinDsService } from './fin-ds.service';
import { CreateFinDFormdto } from './dto/create-fin-d.dto';

import {
    UseTransaction,
    UseForceTransaction,
} from 'src/common/decorator/transaction.decorator';

import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { getClientIP } from 'src/common/utils/ip.utils';

import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('finform/fin-ds')
export class FinDsController {
    constructor(
        private readonly finDsService: FinDsService,
    ) {}

    @Get()
    findAll() {
        return this.finDsService.findAll();
    }

    // ดึงรายการ Head ทั้งหมด สำหรับหน้า show/list
    @Get('show')
    findAllHeadForShow() {
        return this.finDsService.findAllHeadForShow();
    }

    // ดึงรายการเดียว พร้อม head/detail/files
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

    // download file by FILE_ID
    @Get('file/:fileId')
    async downloadFile(
        @Param('fileId') fileId: string,
        @Res() res: Response,
    ) {
        const file = await this.finDsService.findFileById(Number(fileId));

        if (!file) {
            throw new NotFoundException('File not found');
        }

        /*
         * สมมติว่า FIN_FILE เก็บ:
         * FILE_PATH = path folder
         * FILE_FNAME = ชื่อไฟล์จริงที่ system generate
         * FILE_ONAME = ชื่อไฟล์เดิมที่ user upload
         */
        const fullPath = path.join(file.FILE_PATH, file.FILE_FNAME);

        if (!fs.existsSync(fullPath)) {
            throw new NotFoundException('File does not exist on server');
        }

        const originalFileName = file.FILE_ONAME || file.FILE_FNAME;

        return res.download(fullPath, originalFileName);
    }

    @Post()
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(getFileUploadInterceptor('attachfile', true, 20))
    create(
        @Body() dto: CreateFinDFormdto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);

        return this.finDsService.create(dto, files, ip);
    }

    // @create()
    //  create2(
    //     @Body() dto: CreateFinDFormdto,
    //     @UploadedFiles() files: Express.Multer.File[]
    // ) {
    //     return this.finDsService.create(dto,files);
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.finDsService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateFinDDto: UpdateFinDDto) {
    //   return this.finDsService.update(+id, updateFinDDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.finDsService.remove(+id);
    // }
}
