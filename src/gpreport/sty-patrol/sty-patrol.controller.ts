import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StyPatrolService } from './sty-patrol.service';
import { CreateStyPatrolDto } from './dto/create-sty-patrol.dto';
import { UpdateStyPatrolDto } from './dto/update-sty-patrol.dto';

@Controller('sty-patrol')
export class StyPatrolController {
  constructor(private readonly styPatrolService: StyPatrolService) {}

  @Post()
  create(@Body() createStyPatrolDto: CreateStyPatrolDto) {
    return this.styPatrolService.create(createStyPatrolDto);
  }

  @Get()
  findAll() {
    return this.styPatrolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.styPatrolService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStyPatrolDto: UpdateStyPatrolDto) {
    return this.styPatrolService.update(+id, updateStyPatrolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.styPatrolService.remove(+id);
  }
}
