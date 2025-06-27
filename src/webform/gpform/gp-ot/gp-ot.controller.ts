import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GpOtService } from './gp-ot.service';
import { CreateGpOtDto } from './dto/create-gp-ot.dto';
import { UpdateGpOtDto } from './dto/update-gp-ot.dto';

@Controller('gp-ot')
export class GpOtController {
  constructor(private readonly gpOtService: GpOtService) {}

  @Post()
  create(@Body() createGpOtDto: CreateGpOtDto) {
    return this.gpOtService.create(createGpOtDto);
  }

  @Get()
  findAll() {
    return this.gpOtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gpOtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGpOtDto: UpdateGpOtDto) {
    return this.gpOtService.update(+id, updateGpOtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gpOtService.remove(+id);
  }
}
