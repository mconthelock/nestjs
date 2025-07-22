import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FormService } from './form.service';
import { FormmstService } from '../formmst/formmst.service';
import { getFormnoDto } from './dto/get-formno.dto';

@ApiTags('Form')
@Controller('form')
export class FormController {
  constructor(
    private readonly formService: FormService,
    private readonly formmstService: FormmstService,
  ) {}

  @Get(':fno/:orgno/:cyear/:cyear2/:nrunno')
  @ApiOperation({
    summary: 'ตึงข้อมูลจากตาราง Form',
  })
  findOne(
    @Param('fno') fno: string,
    @Param('orgno') orgno: string,
    @Param('cyear') cyear: string,
    @Param('cyear2') cyear2: string,
    @Param('nrunno') nrunno: string,
  ) {
    return this.formService.findOne(+fno, orgno, cyear, cyear2, +nrunno);
  }

  @Get('waitforapprove/:empno')
  @ApiOperation({
    summary: 'ตึงข้อมูลจากตาราง Form',
  })
  waitforapprove(@Param('empno') empno: string) {
    return empno;
  }

  @Get('mine/:empno')
  @ApiOperation({
    summary: 'ตึงข้อมูลจากตาราง Form',
  })
  mine(@Param('empno') empno: string) {
    return empno;
  }

  @Get('finish/:empno')
  @ApiOperation({
    summary: 'ตึงข้อมูลจากตาราง Form',
  })
  finish(@Param('empno') empno: string) {
    return empno;
  }

  @Get('underprepare/:empno')
  @ApiOperation({
    summary: 'ตึงข้อมูลจากตาราง Form',
  })
  underprepare(@Param('empno') empno: string) {
    return empno;
  }

  @Post('getformno')
  @ApiOperation({
    summary: 'Get Formno',
  })
  async getFormno(@Body() dto: getFormnoDto, @Req() req: Request) {
    // const form = await this.formmstService.getFormmst(dto, req.headers.host);
    // console.log(form);
    // // เอาเลขปี 2 หลักสุดท้าย
    // const year2 = dto.CYEAR2.substring(2, 4); // ถ้า "2024" ได้ "24"

    // // เติมเลข running 6 หลัก (ถ้าเป็นเลข integer ให้แปลงเป็น string ก่อน)
    // const runNo = String(dto.NRUNNO).padStart(6, '0'); // เช่น 1 => "000001"
    // return `${form[0].VANAME}${year2}-${runNo}`;
    return this.formService.getFormno(dto, req.headers.host);
  }

  


}
