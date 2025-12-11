import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IsFileService } from './is-file.service';
import { CreateIsFileDto } from './dto/create-is-file.dto';
import { UpdateIsFileDto } from './dto/update-is-file.dto';
import { SearchIsFileDto } from './dto/search-is-file.dto';

@Controller('isform/is-file')
export class IsFileController {
  constructor(private readonly isFileService: IsFileService) {}

  @Post('insert')
  async insert(@Body() dto: CreateIsFileDto) {
    return await this.isFileService.insert(dto);
  }

  @Post('getFile')
  async getFile(@Body() dto: SearchIsFileDto) {
    return await this.isFileService.getFile(dto);
  }
}
