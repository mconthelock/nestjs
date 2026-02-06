import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PurCpmService } from './pur-cpm.service';
import { CreatePurCpmDto } from './dto/create-pur-cpm.dto';
import { UpdatePurCpmDto } from './dto/update-pur-cpm.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Controller('purform/pur-cpm')
export class PurCpmController {
  constructor(private readonly purCpmService: PurCpmService) {}

  private readonly path =
    `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/PUR/PURCPM/` as string;

  @Get('year/:year')
  findByYear(@Param('year') year: string) {
    return this.purCpmService.findbyYear(year);
  }

  @Post('data')
  getData(@Body() dto: FormDto) {
    return this.purCpmService.getData(dto);
  }

  @Post()
  @UseInterceptors(getFileUploadInterceptor('files', true))
  create(
    @Body() dto: CreatePurCpmDto,
    @UploadedFiles()
    files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const ip = getClientIP(req);
    return this.purCpmService.create(dto, files, ip, this.path);
  }
}
