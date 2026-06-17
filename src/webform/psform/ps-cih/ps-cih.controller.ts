import { Controller, Post, Body, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PsCihService } from './ps-cih.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { CreateLogDto } from '../ps-ci/dto/createlog.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { InsertAndMoveHandleFileFormDto } from 'src/webform/handle-file-form/dto/create-handle-file-form.dto';

@Controller('ps-cih')
export class PsCihController {
    constructor(private readonly psCihService: PsCihService) {}

    @Post('getDataForm')
    getDataForm(@Body() body: FormDto) {
        return this.psCihService.getDataForm(body);
    }

    @Post('insertLog')
    insertLog(@Body() body: CreateLogDto) {
        return this.psCihService.insertLog(body);
    }

    @Post('reportData')
    getReportData(@Body() dto: FormDto) {
        return this.psCihService.getReportData(dto);
    }

    @Post('uploadFile')
    @UseInterceptors(getFileUploadInterceptor('file'))
    uploadFile(
        @Body() body: InsertAndMoveHandleFileFormDto,
        @UploadedFile() file: Express.Multer.File[],
    ) {
        return this.psCihService.uploadFile(body, file);
    }
}
