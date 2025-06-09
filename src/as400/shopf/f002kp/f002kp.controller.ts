import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { F002kpService } from './f002kp.service';
import { CreateF002kpDto } from './dto/create-f002kp.dto';
import { UpdateF002kpDto } from './dto/update-f002kp.dto';

@Controller('f002kp')
export class F002kpController {
  constructor(private readonly f002kpService: F002kpService) {}

  @Post()
  create(@Body() createF002kpDto: CreateF002kpDto) {
    return this.f002kpService.create(createF002kpDto);
  }

  @Get()
  findAll() {
    return this.f002kpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.f002kpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateF002kpDto: UpdateF002kpDto) {
    return this.f002kpService.update(+id, updateF002kpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.f002kpService.remove(+id);
  }
}
