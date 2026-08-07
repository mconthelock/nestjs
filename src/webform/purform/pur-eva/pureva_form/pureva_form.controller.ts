import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurevaFormService } from './pureva_form.service';
import { CreatePurevaFormDto } from './dto/create-pureva_form.dto';
import { UpdatePurevaFormDto } from './dto/update-pureva_form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Controller('purform/pureva-form')
export class PurevaFormController {
  constructor(private readonly purevaFormService: PurevaFormService) {}

  @Post('data')
  create(@Body() dto: FormDto) {
    return this.purevaFormService.getData(dto);
  }

    // @Post('data')
    // getData(@Body() dto: FormDto) {
    //         return this.purnvfFormService.getData(dto);
    // }

  @Get()
  findAll() {
    return this.purevaFormService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purevaFormService.findOne(+id);
  }

  @Patch('update')
  async update(         // ใช้สำหรับรับเงื่อนไขในการค้นหา (เช่น id หรือ key) ผ่าน Query Parameters
    @Body() dto: UpdatePurevaFormDto   // ใช้สำหรับรับข้อมูลใหม่ที่ต้องการอัปเดตผ่าน Request Body
  ) {
    try {
      const { NFRMNO , VORGNO , CYEAR , CYEAR2 , NRUNNO , ...data } = dto;
      const form= {
        NFRMNO : NFRMNO,
        VORGNO : VORGNO,
        CYEAR : CYEAR,
        CYEAR2 : CYEAR2,
        NRUNNO : NRUNNO 
      }
      return await this.purevaFormService.update(form, data);
    } catch (error) {
      throw new Error('Update PUR-EVA Form Error: ' + error.message);
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePurevaFormDto: UpdatePurevaFormDto) {
  //   return this.purevaFormService.update(+id, updatePurevaFormDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purevaFormService.remove(+id);
  }
}
