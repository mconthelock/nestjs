import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FormService } from './form.service';

@ApiTags('Form')
@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

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
}
