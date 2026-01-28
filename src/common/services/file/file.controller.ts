import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  Post,
  Body,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Response } from 'express';
import { getBase64Image } from 'src/common/utils/files.utils';
import * as fs from 'fs';
import { FileService } from './file.service';
import { FileDto, ListDto, SaveFileDto } from './dto/file.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';

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

  @Post('list')
  async list(@Body() dto: ListDto) {
    return await this.fileService.listDir(dto);
  }

  @Post('listAll')
  async listAll(@Body() dto: ListDto) {
    return await this.fileService.listAllRecursively(dto);
  }

  @Post('template/read')
  async exportTemplate(
    @Body() body: { path: string; name: string },
    @Res() res: Response,
  ) {
    if (!fs.existsSync(body.path)) {
      throw new BadRequestException('File not found on disk');
    }

    const fileContent = fs.readFileSync(body.path);
    const base64String = fileContent.toString('base64');

    return res.json({
      filename: body.name,
      content: base64String,
    });
  }

  @Post('saveFile')
//   @UseInterceptors(AnyFilesInterceptor())
  @UseInterceptors(getFileUploadInterceptor())
//   @UseInterceptors(
//       getFileUploadInterceptor([
//         { name: 'test', maxCount: 10 },
//       ]),
//     )
  async saveFile(@UploadedFiles() files: Express.Multer.File[],@Body() dto: SaveFileDto) {
    return await this.fileService.saveFile(files, dto);
  }
}
