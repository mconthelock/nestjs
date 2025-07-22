import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { CreateQainsFormDto } from './dto/create-qains_form.dto';

import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiTags('QA-INS Form')
@Controller('qains-form')
export class QainsFormController {
  constructor(private readonly qainsFormService: QainsFormService) {}

  private readonly path = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/Form/QA/QAINS/`;

  @ApiExcludeEndpoint()
  @Post('request')
  @UseInterceptors(getFileUploadInterceptor('file'))
  uploadUserFile(
    @UploadedFiles() file: Express.Multer.File,
    @Body() dto: CreateQainsFormDto   // รับข้อมูลอื่น ๆ ทั้งหมดเป็น object
  ) {
    
    // const formno = getformno(dto.NFRMNO, dto.VORGNO, dto.CYEAR, dto.CYEAR2, dto.NRUNNO) || '';
    // return {
    //   formno,
    //   file,
    // };
  }

 
}
