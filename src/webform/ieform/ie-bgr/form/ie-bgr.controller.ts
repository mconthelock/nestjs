import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { IeBgrService } from './ie-bgr.service';
import { CreateIeBgrDto, DraftIeBgrDto } from './dto/create-ie-bgr.dto';
import { UpdateIeBgrDto } from './dto/update-ie-bgr.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { LastApvIeBgrDto } from './dto/lastapv-ie-bgr.dto';

@Controller('ieform/ie-bgr')
export class IeBgrController {
  constructor(private readonly ieBgrService: IeBgrService) {}

  private readonly path = `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/IE/IEBGR/` as string;

  @Post('create')
  @UseInterceptors(
    getFileUploadInterceptor([
      { name: 'imageI[]', maxCount: 10 },
      { name: 'imageP[]', maxCount: 10 },
      { name: 'imageD[]', maxCount: 10 },
      { name: 'imageN[]', maxCount: 10 },
      { name: 'imageE[]', maxCount: 10 },
      { name: 'imageS[]', maxCount: 10 },
      { name: 'fileP[]', maxCount: 10 },
      { name: 'fileR[]', maxCount: 10 },
      { name: 'fileS[]', maxCount: 10 },
      { name: 'fileM[]', maxCount: 10 },
      { name: 'fileE[]', maxCount: 10 },
      { name: 'fileU[]', maxCount: 10 },
      { name: 'fileO[]', maxCount: 10 },
    ]),
  )
  create(
    @Body() dto: CreateIeBgrDto,
    @UploadedFiles()
    files: {
      imageI?: Express.Multer.File[];
      imageP?: Express.Multer.File[];
      imageD?: Express.Multer.File[];
      imageN?: Express.Multer.File[];
      imageE?: Express.Multer.File[];
      imageS?: Express.Multer.File[];
      fileP?: Express.Multer.File[];
      fileR?: Express.Multer.File[];
      fileS?: Express.Multer.File[];
      fileM?: Express.Multer.File[];
      fileE?: Express.Multer.File[];
      fileU?: Express.Multer.File[];
      fileO?: Express.Multer.File[];
    },
    @Req() req: Request,
  ) {
    const ip = getClientIP(req);
    return this.ieBgrService.create(dto, files, ip, this.path);
  }

  @Post('draft')
  @UseInterceptors(
    getFileUploadInterceptor([
      { name: 'imageI[]', maxCount: 10 },
      { name: 'imageP[]', maxCount: 10 },
      { name: 'imageD[]', maxCount: 10 },
      { name: 'imageN[]', maxCount: 10 },
      { name: 'imageE[]', maxCount: 10 },
      { name: 'imageS[]', maxCount: 10 },
      { name: 'fileP[]', maxCount: 10 },
      { name: 'fileR[]', maxCount: 10 },
      { name: 'fileS[]', maxCount: 10 },
      { name: 'fileM[]', maxCount: 10 },
      { name: 'fileE[]', maxCount: 10 },
      { name: 'fileU[]', maxCount: 10 },
      { name: 'fileO[]', maxCount: 10 },
    ]),
  )
  draft(
    @Body() dto: DraftIeBgrDto,
    @UploadedFiles()
    files: {
      imageI?: Express.Multer.File[];
      imageP?: Express.Multer.File[];
      imageD?: Express.Multer.File[];
      imageN?: Express.Multer.File[];
      imageE?: Express.Multer.File[];
      imageS?: Express.Multer.File[];
      fileP?: Express.Multer.File[];
      fileR?: Express.Multer.File[];
      fileS?: Express.Multer.File[];
      fileM?: Express.Multer.File[];
      fileE?: Express.Multer.File[];
      fileU?: Express.Multer.File[];
      fileO?: Express.Multer.File[];
    },
    @Req() req: Request,
  ) {
    const ip = getClientIP(req);
    return this.ieBgrService.draft(dto, files, ip, this.path);
  }

  @Post('lastApprove')
  lastApprove(@Body() dto: LastApvIeBgrDto, @Req() req: Request) {
    const ip = getClientIP(req);
    return this.ieBgrService.lastApprove(dto, ip);
  }

  @Post('report')
  report(@Body() dto: UpdateIeBgrDto) {
    return this.ieBgrService.report(dto);
  }
}
