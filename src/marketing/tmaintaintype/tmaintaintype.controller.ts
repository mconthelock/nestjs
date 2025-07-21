import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TmaintaintypeService } from './tmaintaintype.service';
import { CreateTmaintaintypeDto } from './dto/create-tmaintaintype.dto';
import { UpdateTmaintaintypeDto } from './dto/update-tmaintaintype.dto';

@Controller('tmaintaintype')
export class TmaintaintypeController {
  constructor(private readonly tmaintaintypeService: TmaintaintypeService) {}

  @Post()
  create(@Body() createTmaintaintypeDto: CreateTmaintaintypeDto) {
    return this.tmaintaintypeService.create(createTmaintaintypeDto);
  }

  @Get()
  findAll() {
    return this.tmaintaintypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tmaintaintypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTmaintaintypeDto: UpdateTmaintaintypeDto) {
    return this.tmaintaintypeService.update(+id, updateTmaintaintypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tmaintaintypeService.remove(+id);
  }
}
