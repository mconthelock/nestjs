import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IsMoService } from './is-mo.service';
import { CreateIsMoDto } from './dto/create-is-mo.dto';
import { UpdateIsMoDto } from './dto/update-is-mo.dto';

@Controller('is-mo')
export class IsMoController {
  constructor(private readonly isMoService: IsMoService) {}

  @Post()
  create(@Body() createIsMoDto: CreateIsMoDto) {
    return this.isMoService.create(createIsMoDto);
  }

  @Get()
  findAll() {
    return this.isMoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.isMoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIsMoDto: UpdateIsMoDto) {
    return this.isMoService.update(+id, updateIsMoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.isMoService.remove(+id);
  }
}
