import { Controller, Get, Param, Query, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { getBase64Image } from 'src/common/utils/files.utils';
import { FileService } from './file.service';
import { FileDto } from './dto/file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FileService) {}

  @Post('/OpenOrDownload')
  async downloadOrOpenFile(@Body() args: FileDto) {
    return await this.fileService.downloadOrOpenFile({
      baseDir: args.baseDir,
      storedName: args.storedName,
      originalName: args.originalName,
      mode: args.mode,
    });
  }

  @Post('getBase64Image')
  async getImage(@Body() data: { path: string }) {
    return getBase64Image(data.path);
  }

  @Get('list')
  async list(@Query('baseDir') baseDir: string, @Query('path') path = '') {
    return await this.fileService.listDir(baseDir, path);
  }

  @Get('listAll')
  async listAll(@Query('baseDir') baseDir: string, @Query('path') path = '') {
    return await this.fileService.listAllRecursively(baseDir, path);
  }
}
