import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IsForm3Service } from './is-form3.service';
import { CreateIsForm3Dto } from './dto/create-is-form3.dto';
import { UpdateIsForm3Dto } from './dto/update-is-form3.dto';

@Controller('is-form3')
export class IsForm3Controller {
  constructor(private readonly isForm3Service: IsForm3Service) {}

  @Post()
  create(@Body() createIsForm3Dto: CreateIsForm3Dto) {
    return this.isForm3Service.create(createIsForm3Dto);
  }

  @Get()
  findAll() {
    return this.isForm3Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.isForm3Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIsForm3Dto: UpdateIsForm3Dto) {
    return this.isForm3Service.update(+id, updateIsForm3Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.isForm3Service.remove(+id);
  }
}
