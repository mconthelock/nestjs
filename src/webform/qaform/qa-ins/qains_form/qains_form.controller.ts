import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { CreateQainsFormDto } from './dto/create-qains_form.dto';
import { SearchQainsFormDto } from './dto/search-qains_form.dto';
import { QainsFormDto } from './dto/qains_form.dto';
import { Request } from 'express';

import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

import { getClientIP } from 'src/common/utils/ip.utils';

@ApiTags('QA-INS Form')
@Controller('qaform/qa-ins')
export class QainsFormController {
  constructor(private readonly qainsFormService: QainsFormService) {}

  private readonly path = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/Form/QA/QAINS/`;

  @ApiExcludeEndpoint()
  @Post('request')
  @UseInterceptors(getFileUploadInterceptor('files', true, 20))
  async uploadUserFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateQainsFormDto ,
    @Req() req: Request
  ) {
    const ip = getClientIP(req);
    return this.qainsFormService.createQainsForm(dto, files, ip, this.path);
  }

  @Post('getFormData')
  async getFormData(@Body() dto: QainsFormDto) {
    return await this.qainsFormService.getFormData(dto);
  }

  @Post('search')
  async search(@Body() dto: SearchQainsFormDto) {
    return await this.qainsFormService.search(dto);
  }
}
