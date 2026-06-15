import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VorgmstService } from './vorgmst.service';
import { CreateVorgmstDto } from './dto/create-vorgmst.dto';
import { UpdateVorgmstDto } from './dto/update-vorgmst.dto';

@Controller('vorgmst')
export class VorgmstController {
  constructor(private readonly vorgmstService: VorgmstService) {}

  @Post()
  create(@Body() createVorgmstDto: CreateVorgmstDto) {
    return this.vorgmstService.create(createVorgmstDto);
  }

  @Get()
  findAll() {
    return this.vorgmstService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vorgmstService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVorgmstDto: UpdateVorgmstDto) {
    return this.vorgmstService.update(+id, updateVorgmstDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vorgmstService.remove(+id);
  }
}
