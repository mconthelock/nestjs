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

@Controller('pur-file')
export class PurFileController {
  constructor(private readonly purFileService: PurFileService) {}

  @Post('getFile')
  async getFile(@Body() dto: SearchPurFileDto) {
    return await this.purFileService.getFile(dto);
  }
}
