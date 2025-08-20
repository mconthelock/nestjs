import { Controller, Get, Param, Query, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { FileService } from 'src/common/services/file.service';

interface Args {
  baseDir: string;
  storedName: string;
  originalName?: string;
  mode: 'open' | 'download';
}
@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FileService) {}

  @Post('/OpenOrDownload')
  async downloadOrOpenFile(@Body() args: Args) {
    return this.fileService.downloadOrOpenFile({
      baseDir: args.baseDir,
      storedName: args.storedName,
      originalName: args.originalName,
      mode: args.mode,
    });
  }
}
