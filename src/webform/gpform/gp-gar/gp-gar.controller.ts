import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UploadedFile,UploadedFiles } from '@nestjs/common';
import { GpGarService } from './gp-gar.service';
import { CreateGpGarDto } from './dto/create-gp-gar.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';

@Controller('gpform/gp-gar')
export class GpGarController {
  constructor(private readonly gpGarService: GpGarService) {}

  @Get()
  findAll(){
    return this.gpGarService.findAll();
  }

  @Post()
  @UseTransaction('webformConnection')
  @UseInterceptors(getFileUploadInterceptor('FILE'))
  create(
  @Body() dto: CreateGpGarDto, 
  @Req() req: Request,
  @UploadedFile() file: Express.Multer.File,
  ){
    const ip = getClientIP(req)
    return this.gpGarService.create(dto, ip, file);
  }

   @Get('/:fno/:orgno/:cyear/:cyear2/:nrunno')
  findOne(
    @Param('fno') fno: number,
    @Param('orgno') orgno: string,  
    @Param('cyear') cyear: string,
    @Param('cyear2') cyear2: string,
    @Param('nrunno') nrunno: number,
  ){
    return this.gpGarService.findOne({NFRMNO: fno, VORGNO: orgno, CYEAR: cyear, CYEAR2: cyear2, NRUNNO: nrunno});
  }
}

@Controller('gpform/gp-gar')
export class GpGarForm {
  constructor(private readonly gpGarService: GpGarService) {}
};
