import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IsOffService } from './is-off.service';
import { CreateIsOffDto } from './dto/create-is-off.dto';
import { UpdateIsOffDto } from './dto/update-is-off.dto';

@Controller('is-off')
export class IsOffController {
  constructor(private readonly isOffService: IsOffService) {}

  @Post()
  create(@Body() createIsOffDto: CreateIsOffDto) {
    return this.isOffService.create(createIsOffDto);
  }

  @Get()
  findAll() {
    return this.isOffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.isOffService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIsOffDto: UpdateIsOffDto) {
    return this.isOffService.update(+id, updateIsOffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.isOffService.remove(+id);
  }
}
