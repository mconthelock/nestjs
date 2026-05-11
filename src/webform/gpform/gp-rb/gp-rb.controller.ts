import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors } from '@nestjs/common';
import { GpRbService, ShowCusstampGpRbService, ShowstampGpRbService} from './gp-rb.service';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateGpRbDto } from './dto/update-gp-rb.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from "express";
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';


@Controller('gpform/gp-rb')
export class GpRbController {
  constructor(
    private readonly gpRbServicee: GpRbService, ){}


  @Get()
  findAll(){
    return this.gpRbServicee.findAll();
  }

   /*stampFormatGroup ถูกแก้ไขเข้ามาเพื่อจะเลือกข้อมูลไป insert เข้าตาราง */
  @Post()
  @UseTransaction('webformConnection')
  @UseInterceptors(getFileUploadInterceptor())
  create(@Body() dto: CreateGpRbDto, @Req() req:Request) {
    const ip = getClientIP(req)
    return this.gpRbServicee.create(dto, ip);
  }
}


// สำหรับดึงข้อมูลแสดงในหน้า show-gp-rb by Plankton
@Controller('gpform/showstamp-gp-rb')
export class ShowstampGpRbController {
  constructor(private readonly gpRbServicee: ShowstampGpRbService) {}

  @Get()
  findAll(){
    return this.gpRbServicee.findAll();
  }
}    

// สำหรับดึงข้อมูลแสดงในหน้า show-cus-stamp-gp-rb by Plankton  
@Controller('gpform/showcusstamp-gp-rb')
export class ShowCusStampGpRbController {
  constructor(private readonly gpRbServicee: ShowCusstampGpRbService) {} 

  @Get()
  findAll(){
    return this.gpRbServicee.findAll();
  } 
}

