import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PvenderService } from './pvender.service';
import { CreatePvenderDto } from './dto/create-pvender.dto';
import { UpdatePvenderDto } from './dto/update-pvender.dto';

@Controller('pvender')
export class PvenderController {
  constructor(private readonly pvenderService: PvenderService) {}

  @Post()
  create(@Body() createPvenderDto: CreatePvenderDto) {
    return this.pvenderService.create(createPvenderDto);
  }

  @Get()
  findAll() {
    return this.pvenderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pvenderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePvenderDto: UpdatePvenderDto) {
    return this.pvenderService.update(+id, updatePvenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pvenderService.remove(+id);
  }
}
