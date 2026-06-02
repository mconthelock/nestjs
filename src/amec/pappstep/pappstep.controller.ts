import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PappstepService } from './pappstep.service';
import { CreatePappstepDto } from './dto/create-pappstep.dto';
import { UpdatePappstepDto } from './dto/update-pappstep.dto';

@Controller('pappstep')
export class PappstepController {
  constructor(private readonly pappstepService: PappstepService) {}

  @Post()
  create(@Body() createPappstepDto: CreatePappstepDto) {
    return this.pappstepService.create(createPappstepDto);
  }

  @Get()
  findAll() {
    return this.pappstepService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pappstepService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePappstepDto: UpdatePappstepDto) {
    return this.pappstepService.update(+id, updatePappstepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pappstepService.remove(+id);
  }
}
