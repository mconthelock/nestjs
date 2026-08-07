import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TurnoverunitService } from './turnoverunit.service';
import { CreateTurnoverunitDto } from './dto/create-turnoverunit.dto';
import { UpdateTurnoverunitDto } from './dto/update-turnoverunit.dto';

@Controller('turnoverunit')
export class TurnoverunitController {
  constructor(private readonly turnoverunitService: TurnoverunitService) {}

  @Post()
  create(@Body() createTurnoverunitDto: CreateTurnoverunitDto) {
    return this.turnoverunitService.create(createTurnoverunitDto);
  }

  @Get()
  findAll() {
    return this.turnoverunitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnoverunitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnoverunitDto: UpdateTurnoverunitDto) {
    return this.turnoverunitService.update(+id, updateTurnoverunitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnoverunitService.remove(+id);
  }
}
