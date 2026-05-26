import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurnvfFormService } from './purnvf_form.service';
import { CreatePurnvfFormDto } from './dto/create-purnvf_form.dto';
import { UpdatePurnvfFormDto } from './dto/update-purnvf_form.dto';

@Controller('purnvf-form')
export class PurnvfFormController {
  constructor(private readonly purnvfFormService: PurnvfFormService) {}

  @Post()
  create(@Body() createPurnvfFormDto: CreatePurnvfFormDto) {
    return this.purnvfFormService.create(createPurnvfFormDto);
  }

  @Get()
  findAll() {
    return this.purnvfFormService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purnvfFormService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurnvfFormDto: UpdatePurnvfFormDto) {
    return this.purnvfFormService.update(+id, updatePurnvfFormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purnvfFormService.remove(+id);
  }
}
