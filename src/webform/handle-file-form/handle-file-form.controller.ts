import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UploadedFile,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { HandleFileFormService } from './handle-file-form.service';
import { CreateHandleFileFormDto, InsertAndMoveHandleFileFormDto } from './dto/create-handle-file-form.dto';
import { UpdateHandleFileFormDto } from './dto/update-handle-file-form.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';

@Controller('webform/file')
export class HandleFileFormController {
    constructor(
        private readonly handleFileFormService: HandleFileFormService,
    ) {}

    @Post()
    @UseInterceptors(getFileUploadInterceptor())
    async insertFileOne(
        @Body() dto: InsertAndMoveHandleFileFormDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return await this.handleFileFormService.insertFiles(dto, files);
    }
}
