import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    ParseIntPipe,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { PsCiService } from './ps-ci.service';
import { CreateLogDto } from './dto/createlog.dto';
import { GetDataFormDto } from './dto/create-ps-ci.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { InsertAndMoveHandleFileFormDto } from 'src/webform/handle-file-form/dto/create-handle-file-form.dto';

@Controller('ps-ci')
export class PsCiController {
    constructor(private readonly psCiService: PsCiService) {}

    @Post('getDataForm')
    getDataForm(@Body() body: GetDataFormDto) {
        return this.psCiService.getDataForm(body);
    }

    @Post('insertLog')
    createLog(@Body() body: CreateLogDto) {
        return this.psCiService.createLog(body);
    }
    

    // @Post('updateCheckResult')
    // updateCheckResult(@Body() body: { data: any }) {
    //     console.log(body);
        
    //     const data = body.data;
    //     return this.psCiService.updateCheckResult(data);
    // }

    @Post('uploadFile')
    @UseInterceptors(getFileUploadInterceptor('file'))
    uploadFile(@Body() body: InsertAndMoveHandleFileFormDto, @UploadedFile() file: Express.Multer.File[]) {
        return this.psCiService.uploadFile(body, file);
    }

    @Get('inv-check-log/:assignId')
    getLogs(@Param('assignId', ParseIntPipe) assignId: number) {
        return this.psCiService.getLogs(assignId);
    }
}
