import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { IsAdpService } from './is-adp.service';
import { CreateIsAdpDto } from './dto/create-is-adp.dto';
import { UpdateIsAdpDto } from './dto/update-is-adp.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { Request } from 'express';
import { getClientIP } from 'src/common/utils/ip.utils';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Controller('isform/is-adp')
export class IsAdpController {
  constructor(private readonly isAdpService: IsAdpService) {}

  private readonly path = `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/IS/ISADP/`;

  @Post('insert')
  @UseInterceptors(getFileUploadInterceptor('file'))
  async insert(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateIsAdpDto,
    @Req() req: Request,
  ) {
    const ip = getClientIP(req);
    return await this.isAdpService.create(dto, file, ip, this.path);
  }

  @Post('getData')
    async getData(@Body() dto: FormDto) {
    return await this.isAdpService.getData(dto);
  }
}
