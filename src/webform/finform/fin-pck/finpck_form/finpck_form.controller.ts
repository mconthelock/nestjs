import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinpckFormService } from './finpck_form.service';
import { CreateFinpckFormDto } from './dto/create-finpck_form.dto';
import { UpdateFinpckFormDto } from './dto/update-finpck_form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Controller('finform/finpck-form')
export class FinpckFormController {
  constructor(private readonly finpckFormService: FinpckFormService) {}

  @Post()
  create(@Body() createFinpckFormDto: CreateFinpckFormDto) {
    return this.finpckFormService.create(createFinpckFormDto);
  }

  @Post('data')
    getData(@Body() dto: FormDto) {
            return this.finpckFormService.getData(dto);
  }

  @Get()
  findAll() {
    return this.finpckFormService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finpckFormService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinpckFormDto: UpdateFinpckFormDto) {
    return this.finpckFormService.update(+id, updateFinpckFormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finpckFormService.remove(+id);
  }
}
