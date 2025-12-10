import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IsAdpService } from './is-adp.service';
import { CreateIsAdpDto } from './dto/create-is-adp.dto';
import { UpdateIsAdpDto } from './dto/update-is-adp.dto';

@Controller('is-adp')
export class IsAdpController {
  constructor(private readonly isAdpService: IsAdpService) {}

  @Post()
  create(@Body() createIsAdpDto: CreateIsAdpDto) {
    return this.isAdpService.create(createIsAdpDto);
  }

  @Get()
  findAll() {
    return this.isAdpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.isAdpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIsAdpDto: UpdateIsAdpDto) {
    return this.isAdpService.update(+id, updateIsAdpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.isAdpService.remove(+id);
  }
}
