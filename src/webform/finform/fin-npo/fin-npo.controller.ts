import {
    Body, Controller, Get, NotFoundException, Param, Post, Req, Res,
    UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

import {
    UseForceTransaction,
    UseTransaction,
} from 'src/common/decorator/transaction.decorator';
import { getClientIP } from 'src/common/utils/ip.utils';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import {
    ActionFinnpoDto,
    CreateFinnpoDto,
    FinnpoReportFilterDto,
    FinnpoService,
} from './fin-npo.service';

@Controller('finform/fin-npo')
export class FinnpoController {
    constructor(private readonly finnpoService: FinnpoService) {}

    @Get()
    findAll() {
        return this.finnpoService.findAll();
    }

    @Get('expense')
    findAllExpenseForShow() {
        return this.finnpoService.findAllExpenseForShow();
    }

    @Get('vendor')
    findAllVendorForShow() {
        return this.finnpoService.findAllVendorForShow();
    }

    @Get('currency')
    findAllCurrencyForShow() {
        return this.finnpoService.findAllCurrencyForShow();
    }

    @Get('costcenter')
    findAllCostCenterForShow() {
        return this.finnpoService.findAllCostCenterForShow();
    }

    @Post('report')
    findReport(@Body() dto: FinnpoReportFilterDto) {
        return this.finnpoService.findReport(dto);
    }

    @Get('show/:nfrmno/:vorgno/:cyear/:cyear2/:nrunno')
    findOneForShow(
        @Param('nfrmno') nfrmno: string,
        @Param('vorgno') vorgno: string,
        @Param('cyear') cyear: string,
        @Param('cyear2') cyear2: string,
        @Param('nrunno') nrunno: string,
    ) {
        return this.finnpoService.findOneForShow(
            Number(nfrmno),
            vorgno,
            cyear,
            cyear2,
            Number(nrunno),
        );
    }

    @Post()
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(getFileUploadInterceptor('attachfile', true, 20))
    create(
        @Body() dto: CreateFinnpoDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        return this.finnpoService.create(dto, files, getClientIP(req));
    }

    @Get('file/:fileId')
    async downloadFile(@Param('fileId') fileId: string, @Res() res: Response) {
        const file = await this.finnpoService.findFileById(Number(fileId));
        if (!file) throw new NotFoundException('File not found');

        const fullPath = path.join(file.FILE_PATH, file.FILE_FNAME);
        if (!fs.existsSync(fullPath)) {
            throw new NotFoundException('File does not exist on server');
        }

        return res.download(fullPath, file.FILE_ONAME || file.FILE_FNAME);
    }

    @Post('action')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    action(@Body() dto: ActionFinnpoDto, @Req() req: Request) {
        return this.finnpoService.action(dto, getClientIP(req));
    }

    @Post('update')
    @UseTransaction('webformConnection')
    @UseForceTransaction()
    @UseInterceptors(getFileUploadInterceptor('attachfile', true, 20))
    update(
        @Body() dto: ActionFinnpoDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.finnpoService.update(dto, files);
    }
}
