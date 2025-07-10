import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { M008kpService } from './m008kp.service';
import { CreateM008kpDto } from './dto/create-m008kp.dto';
import { UpdateM008kpDto } from './dto/update-m008kp.dto';

@Controller('m008kp')
export class M008kpController {
  constructor(private readonly m008kpService: M008kpService) {}

  @Post()
  create(@Body() createM008kpDto: CreateM008kpDto) {
    return this.m008kpService.create(createM008kpDto);
  }

  @Get()
  findAll() {
    return this.m008kpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.m008kpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateM008kpDto: UpdateM008kpDto) {
    return this.m008kpService.update(+id, updateM008kpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.m008kpService.remove(+id);
  }
}
