import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TurmcodeService } from './turmcode.service';
import { CreateTurmcodeDto } from './dto/create-turmcode.dto';
import { UpdateTurmcodeDto } from './dto/update-turmcode.dto';

@Controller('turmcode')
export class TurmcodeController {
  constructor(private readonly turmcodeService: TurmcodeService) {}

  @Post()
  create(@Body() createTurmcodeDto: CreateTurmcodeDto) {
    return this.turmcodeService.create(createTurmcodeDto);
  }

  @Get()
  findAll() {
    return this.turmcodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turmcodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurmcodeDto: UpdateTurmcodeDto) {
    return this.turmcodeService.update(+id, updateTurmcodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turmcodeService.remove(+id);
  }
}
