import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GpRbService } from './gp-rb.service';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateGpRbDto } from './dto/update-gp-rb.dto';

@Controller('gp-rb')
export class GpRbController {
  constructor(private readonly gpRbService: GpRbService) {}

  @Post()
  create(@Body() createGpRbDto: CreateGpRbDto) {
    return this.gpRbService.create(createGpRbDto);
  }

  @Get()
  findAll() {
    return this.gpRbService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gpRbService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGpRbDto: UpdateGpRbDto) {
    return this.gpRbService.update(+id, updateGpRbDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gpRbService.remove(+id);
  }
}
