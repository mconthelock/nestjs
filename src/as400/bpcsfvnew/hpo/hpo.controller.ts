import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HpoService } from './hpo.service';
import { CreateHpoDto } from './dto/create-hpo.dto';
import { UpdateHpoDto } from './dto/update-hpo.dto';

@Controller('hpo')
export class HpoController {
  constructor(private readonly hpoService: HpoService) {}

  @Post()
  create(@Body() createHpoDto: CreateHpoDto) {
    return this.hpoService.create(createHpoDto);
  }

  @Get()
  findAll() {
    return this.hpoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hpoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHpoDto: UpdateHpoDto) {
    return this.hpoService.update(+id, updateHpoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hpoService.remove(+id);
  }
}
