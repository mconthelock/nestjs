import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RatioService } from './ratio.service';
import { CreateRatioDto } from './dto/create-ratio.dto';
import { UpdateRatioDto } from './dto/update-ratio.dto';

@Controller('ratio')
export class RatioController {
  constructor(private readonly ratioService: RatioService) {}

  @Post()
  create(@Body() createRatioDto: CreateRatioDto) {
    return this.ratioService.create(createRatioDto);
  }

  @Get()
  findAll() {
    return this.ratioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRatioDto: UpdateRatioDto) {
    return this.ratioService.update(+id, updateRatioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratioService.remove(+id);
  }
}
