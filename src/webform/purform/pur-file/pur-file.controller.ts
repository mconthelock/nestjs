import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PurFileService } from './pur-file.service';
import { CreatePurFileDto } from './dto/create-pur-file.dto';
import { UpdatePurFileDto } from './dto/update-pur-file.dto';
import { SearchPurFileDto } from './dto/search-pur-file.dto';
import { SearchHandleFileFormDto } from 'src/webform/center/handle-file-form/dto/search-handle-file-form.dto';

@Controller('pur-file')
export class PurFileController {
    constructor(private readonly purFileService: PurFileService) {}

    @Post('getFile')
    async getFile(@Body() dto: SearchHandleFileFormDto) {
        return await this.purFileService.getFile(dto);
    }
}
