import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IsFileService } from './is-file.service';
import { CreateIsFileDto } from './dto/create-is-file.dto';
import { UpdateIsFileDto } from './dto/update-is-file.dto';

@Controller('isform/is-file')
export class IsFileController {
  constructor(private readonly isFileService: IsFileService) {}

  @Post('insert')
  insert(@Body() dto: CreateIsFileDto) {
    return this.isFileService.insert(dto);
  }

}
