import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { StyFilesService } from './sty-files.service';
import { InsertAndMoveStyFilesDto } from './dto/create.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { UploadedFiles } from '@nestjs/common';

@Controller('gpreport/sty-files')
export class StyFilesController {
    constructor(private readonly styFilesService: StyFilesService) {}

    @Post()
    @UseInterceptors(getFileUploadInterceptor())
    create(
        @Body() dto: InsertAndMoveStyFilesDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.styFilesService.insertFiles(dto, files);
    }
}
