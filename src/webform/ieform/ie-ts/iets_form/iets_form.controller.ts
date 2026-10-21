import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IetsFormService } from './iets_form.service';
import { CreateIetsFormDto } from './dto/create-iets_form.dto';
import { UpdateIetsFormDto } from './dto/update-iets_form.dto';

@Controller('iets-form')
export class IetsFormController {
  constructor(private readonly ietsFormService: IetsFormService) {}

  @Post()
  create(@Body() createIetsFormDto: CreateIetsFormDto) {
    return this.ietsFormService.create(createIetsFormDto);
  }

  @Get()
  findAll() {
    return this.ietsFormService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ietsFormService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIetsFormDto: UpdateIetsFormDto) {
    return this.ietsFormService.update(+id, updateIetsFormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ietsFormService.remove(+id);
  }
}
