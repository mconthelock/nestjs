import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { CreateQainsFormDto } from './dto/create-qains_form.dto';

import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

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
    @Body() dto: CreateQainsFormDto 
  ) {
    return this.qainsFormService.create(dto, files, this.path);
  }

 
}
