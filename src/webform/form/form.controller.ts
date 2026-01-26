import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { FormDto } from './dto/form.dto';
import { empnoFormDto } from './dto/empno-form.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { SearchFormDto } from './dto/search-form.dto';

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

  @Get('count/waitforapprove/:empno')
  countwaitforapprove(@Param('empno') empno: string) {
    return this.formService.countFlow({
      flow: { VREPNO: empno, CSTEPST: '3' },
    });
  }

  @Get('count/coming/:empno')
  countcoming(@Param('empno') empno: string) {
    return this.formService.countFlow({
      flow: { VREPNO: empno, CSTEPST: '2' },
    });
  }

  @Get('count/approved/:empno/:year')
  countapproved(@Param('empno') empno: string, @Param('year') year: string) {
    return this.formService.countFlow({
      flow: { VREALAPV: empno, CSTEPST: '> 3' },
      //   form: { CYEAR2: year },
    });
  }

  @Get('count/underprepare/:empno')
  countunderprepare(@Param('empno') empno: string) {
    return this.formService.countForm({
      form: { VINPUTER: empno, CST: '0' },
      flow: { CSTEPNO: '--' },
    });
  }

  @Get('count/mine/:empno')
  async countmine(@Param('empno') empno: string) {
    const result = await this.formService.countForm({
      flow: { CSTEPNO: '--' },
      form: { VINPUTER: empno, CST: '1' },
    });
    const count = Array.isArray(result) ? result.length : 0;
    console.log('Count of mine forms:', count);

    return result;
  }

  @Get('waitforapprove/:empno')
  @ApiOperation({
    summary: 'Get forms status running and flow step as "wait for approve"',
  })
  waitforapprove(@Param('empno') empno: string) {
    return this.formService.waitforapprove(empno);
  }

  @Get('mine/:empno')
  @ApiOperation({
    summary: 'Get forms status running and have empno as requester',
  })
  mine(@Param('empno') empno: string) {
    return this.formService.mine(empno);
  }

  @Get('finish/:empno/:year')
  @ApiOperation({
    summary: 'Get forms status finished and have empno as requester',
  })
  finish(@Param('empno') empno: string, @Param('year') year: string) {
    return this.formService.finish(empno, year);
  }

  @Get('underprepare/:empno')
  @ApiOperation({
    summary: 'Get forms status under preparation and have empno as requester',
  })
  underprepare(@Param('empno') empno: string) {
    return this.formService.underprepare(empno);
  }

  @Post('getFormno')
  @ApiOperation({
    summary: 'Get Formno',
  })
  async getFormno(@Body() dto: FormDto) {
    return this.formService.getFormno(dto);
  }

  @Get('getPK/:formno')
  @ApiOperation({
    summary: 'Get Form by Formno',
  })
  async getPkByFormno(@Param('formno') formno: string) {
    return this.formService.getPkByFormno(formno);
  }

  @ApiExcludeEndpoint()
  @Post('createForm')
  @ApiOperation({
    summary: 'Create Form',
  })
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() dto: CreateFormDto, @Req() req: Request) {
    const ip = getClientIP(req);
    return this.formService.create(dto, ip);
  }

  @Patch('updateForm')
  async updateForm(
    @Body() dto: UpdateFormDto,
  ): Promise<{ message: string; status: boolean }> {
    try {
      const result = await this.formService.updateForm(dto);
      return {
        message: result ? 'Form updated successfully' : 'Failed to update form',
        status: result,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }

  @ApiExcludeEndpoint()
  @Delete('deleteForm')
  @UseInterceptors(AnyFilesInterceptor())
  async deleteForm(
    @Body() dto: UpdateFormDto,
  ): Promise<{ form: UpdateFormDto; message: string; status: boolean }> {
    try {
      const result = await this.formService.deleteFlowAndForm(dto);
      return {
        form: dto,
        message: result ? 'Form deleted successfully' : 'Failed to delete form',
        status: result,
      };
    } catch (error) {
      throw error; // โยนข้อผิดพลาดกลับไปให้ NestJS จัดการ
    }
  }

  @Post('getFormDetail')
  async getFormDetail(@Body() form: FormDto) {
    return this.formService.getFormDetail(form);
  }

  @Post('getMode')
  async getMode(@Body() form: empnoFormDto) {
    return this.formService.getMode(form);
  }

  @Post('getRequestNo')
  async getRequestNo(@Body('reqNo') reqNo: string) {
    return this.formService.getRequestNo(reqNo);
  }

  @Post('searchForms')
  async searchForms(@Body() dto: SearchFormDto) {
    return await this.formService.searchForms(dto);
  }


  @Post('getFormStatus')
  async getFormStatus(@Body() form: FormDto) {
    return await this.formService.getFormStatus(form);
  }
}
