import { Controller, Post, Body } from '@nestjs/common';
import { IsFileService } from './is-file.service';
import { CreateIsFileDto } from './dto/create-is-file.dto';
import { SearchIsFileDto } from './dto/search-is-file.dto';
import { SearchHandleFileFormDto } from 'src/webform/center/handle-file-form/dto/search-handle-file-form.dto';

@Controller('isform/is-file')
export class IsFileController {
    constructor(private readonly isFileService: IsFileService) {}

    @Post('getFile')
    async getFile(@Body() dto: SearchHandleFileFormDto) {
        return await this.isFileService.getFile(dto);
    }
}
