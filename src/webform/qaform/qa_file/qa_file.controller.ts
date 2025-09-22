import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QaFileService } from './qa_file.service';
import { CreateQaFileDto } from './dto/create-qa_file.dto';
import { UpdateQaFileDto } from './dto/update-qa_file.dto';
import { SearchQaFileDto } from './dto/search-qa_file.dto';

@Controller('qa-file')
export class QaFileController {
  constructor(private readonly qaFileService: QaFileService) {}

  @Post('/insert')
  async createQaFile(@Body() dto: CreateQaFileDto) {
    return this.qaFileService.createQaFile(dto);
  }

  @Post('getQaFile')
  async getQaFile(@Body() dto: SearchQaFileDto) {
    return await this.qaFileService.getQaFile(dto);
  }
}
