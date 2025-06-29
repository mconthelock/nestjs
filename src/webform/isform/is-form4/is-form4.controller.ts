import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IsForm4Service } from './is-form4.service';
import { CreateIsForm4Dto } from './dto/create-is-form4.dto';
import { UpdateIsForm4Dto } from './dto/update-is-form4.dto';

@Controller('is-form4')
export class IsForm4Controller {
  constructor(private readonly isForm4Service: IsForm4Service) {}

  @Post()
  create(@Body() createIsForm4Dto: CreateIsForm4Dto) {
    return this.isForm4Service.create(createIsForm4Dto);
  }

  @Get()
  findAll() {
    return this.isForm4Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.isForm4Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIsForm4Dto: UpdateIsForm4Dto) {
    return this.isForm4Service.update(+id, updateIsForm4Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.isForm4Service.remove(+id);
  }
}
