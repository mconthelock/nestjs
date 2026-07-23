import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, Req } from '@nestjs/common';
import { PurEvaService } from './pur-eva.service';
import { CreatePurEvaDto } from './dto/create-pur-eva.dto';
import { UpdatePurEvaDto } from './dto/update-pur-eva.dto';
import { PurEvaRequestService } from './pur-eva-request.service';
import { RequestPurevaFormDto } from './dto/request-pur-eva.dto';
import { UseForceTransaction, UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { getClientIP } from 'src/common/utils/ip.utils';
 import { Request } from 'express';

@Controller('purform/pur-eva')
export class PurEvaController {
  constructor(private readonly purEvaService: PurEvaRequestService) {}

     private readonly path =
          `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/PUR/PURNVF/` as string;
  

      @Post()
      @UseTransaction('webformConnection')
      @UseForceTransaction()
      @UseInterceptors(getFileUploadInterceptor('files', true))
      create(
          @Body() dto: RequestPurevaFormDto,
          @UploadedFiles()
          files: Express.Multer.File[],
          @Req() req: Request,
      ) {
          const ip = getClientIP(req);
          return this.purEvaService.request(dto, files, ip, this.path);
      }
   

}
