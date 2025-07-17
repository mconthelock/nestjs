import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AftsysdocService } from './aftsysdoc.service';
import { CreateAftsysdocDto } from './dto/create-aftsysdoc.dto';
import { UpdateAftsysdocDto } from './dto/update-aftsysdoc.dto';

@Controller('aftsysdoc')
export class AftsysdocController {
  constructor(private readonly aftsysdocService: AftsysdocService) {}

  @Post()
  create(@Body() createAftsysdocDto: CreateAftsysdocDto) {
    return this.aftsysdocService.create(createAftsysdocDto);
  }

  @Get()
  findAll() {
    return this.aftsysdocService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aftsysdocService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAftsysdocDto: UpdateAftsysdocDto) {
    return this.aftsysdocService.update(+id, updateAftsysdocDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aftsysdocService.remove(+id);
  }
}
