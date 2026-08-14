import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MfgVtrService } from './mfg-vtr.service';
import { CreateMfgVtrDto } from './dto/create-mfg-vtr.dto';
import { UpdateMfgVtrDto } from './dto/update-mfg-vtr.dto';

@Controller('mfg-vtr')
export class MfgVtrController {
  constructor(private readonly mfgVtrService: MfgVtrService) {}

  @Post()
  create(@Body() createMfgVtrDto: CreateMfgVtrDto) {
    return this.mfgVtrService.create(createMfgVtrDto);
  }

  @Get()
  findAll() {
    return this.mfgVtrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mfgVtrService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMfgVtrDto: UpdateMfgVtrDto) {
    return this.mfgVtrService.update(+id, updateMfgVtrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mfgVtrService.remove(+id);
  }
}
