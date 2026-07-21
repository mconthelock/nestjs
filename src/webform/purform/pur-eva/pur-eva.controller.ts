import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurEvaService } from './pur-eva.service';
import { CreatePurEvaDto } from './dto/create-pur-eva.dto';
import { UpdatePurEvaDto } from './dto/update-pur-eva.dto';

@Controller('pur-eva')
export class PurEvaController {
  constructor(private readonly purEvaService: PurEvaService) {}

  @Post()
  create(@Body() createPurEvaDto: CreatePurEvaDto) {
    return this.purEvaService.create(createPurEvaDto);
  }

  @Get()
  findAll() {
    return this.purEvaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purEvaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurEvaDto: UpdatePurEvaDto) {
    return this.purEvaService.update(+id, updatePurEvaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purEvaService.remove(+id);
  }
}
