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
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { FormDto } from './dto/form.dto';
import { getModeDto } from './dto/get-mode.dto';


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

  @Post('getFormno')
  @ApiOperation({
    summary: 'Get Formno',
  })
  async getFormno(@Body() dto: FormDto) {
    return this.formService.getFormno(dto);
  }

  @Post('createForm')
  @ApiOperation({
    summary: 'Create Form',
  })
  create(@Body() dto: CreateFormDto, @Req() req: Request) {
    const ip = getClientIP(req);
    return this.formService.create(dto, ip);
  }

  @Patch('updateForm')
  async updateForm(
    @Body() dto: UpdateFormDto
  ): Promise<{ message: string; status: boolean }> {
    try {
      const result = await this.formService.updateForm(dto);
      return {
        message: result
          ? 'Form updated successfully'
          : 'Failed to update form',
        status: result,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }

  @Delete('deleteForm')
  async deleteForm(
    @Body() dto: UpdateFormDto
  ): Promise<{ message: string; status: boolean }> {
    try {
      const result = await this.formService.deleteFlowAndForm(dto);
      return {
        message: result
          ? 'Form deleted successfully'
          : 'Failed to delete form',
        status: result,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }

  @Post('getFormDetail')
  async getFormDetail(@Body() form: FormDto){
    return this.formService.getFormDetail(form);
  }

  @Post('getMode')
  async getMode(@Body() form: getModeDto){
    return this.formService.getMode(form);
  }
}
