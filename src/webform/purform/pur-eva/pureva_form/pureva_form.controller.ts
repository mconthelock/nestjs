import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurevaFormService } from './pureva_form.service';
import { CreatePurevaFormDto } from './dto/create-pureva_form.dto';
import { UpdatePurevaFormDto } from './dto/update-pureva_form.dto';

@Controller('pureva-form')
export class PurevaFormController {
  constructor(private readonly purevaFormService: PurevaFormService) {}

  @Post()
  create(@Body() createPurevaFormDto: CreatePurevaFormDto) {
    return this.purevaFormService.create(createPurevaFormDto);
  }

  @Get()
  findAll() {
    return this.purevaFormService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purevaFormService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurevaFormDto: UpdatePurevaFormDto) {
    return this.purevaFormService.update(+id, updatePurevaFormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purevaFormService.remove(+id);
  }
}
