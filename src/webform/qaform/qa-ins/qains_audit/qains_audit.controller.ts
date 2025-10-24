import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { QainsAuditService } from './qains_audit.service';
import {
  CreateQainsAuditDto,
  saveQainsAuditDto,
} from './dto/create-qains_audit.dto';
import { UpdateQainsAuditDto } from './dto/update-qains_audit.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';

@Controller('qaform/qa-ins/audit')
export class QainsAuditController {
  constructor(private readonly qainsAuditService: QainsAuditService) {}
  private readonly path = `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/QA/QAINS/`;
  
  @Post('saveAudit')
  @UseInterceptors(getFileUploadInterceptor('files', true, 20))
  async saveAudit(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: saveQainsAuditDto,
  ) {
    return this.qainsAuditService.saveAudit(dto, files, this.path);
  }
}
