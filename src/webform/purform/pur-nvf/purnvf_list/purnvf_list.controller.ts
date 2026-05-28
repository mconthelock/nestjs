import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurnvfListService } from './purnvf_list.service';
import { CreatePurnvfListDto } from './dto/create-purnvf_list.dto';
import { UpdatePurnvfListDto } from './dto/update-purnvf_list.dto';

@Controller('purnvf-list')
export class PurnvfListController {
  constructor(private readonly purnvfListService: PurnvfListService) {}

  @Post()
  create(@Body() createPurnvfListDto: CreatePurnvfListDto) {
    return this.purnvfListService.create(createPurnvfListDto);
  }

  @Get()
  findAll() {
    return this.purnvfListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purnvfListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurnvfListDto: UpdatePurnvfListDto) {
    return this.purnvfListService.update(+id, updatePurnvfListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purnvfListService.remove(+id);
  }
}
