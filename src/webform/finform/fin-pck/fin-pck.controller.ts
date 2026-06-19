import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinPckService } from './fin-pck.service';
import { CreateFinPckDto } from './dto/create-fin-pck.dto';
import { UpdateFinPckDto } from './dto/update-fin-pck.dto';

@Controller('fin-pck')
export class FinPckController {
  constructor(private readonly finPckService: FinPckService) {}

  @Post()
  create(@Body() createFinPckDto: CreateFinPckDto) {
    return this.finPckService.create(createFinPckDto);
  }

  @Get()
  findAll() {
    return this.finPckService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finPckService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinPckDto: UpdateFinPckDto) {
    return this.finPckService.update(+id, updateFinPckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finPckService.remove(+id);
  }
}
