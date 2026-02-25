import { Controller, Get, Post, Body, Patch, Param, Delete, Search } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';

@Controller('overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post('search')
  search(@Body() q: UpdateOvertimeDto) {
    return this.overtimeService.findAll(q);
  }
  @Post()
  create(@Body() createOvertimeDto: CreateOvertimeDto) {
    return this.overtimeService.create(createOvertimeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.overtimeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOvertimeDto: UpdateOvertimeDto) {
    return this.overtimeService.update(+id, updateOvertimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.overtimeService.remove(+id);
  }
}
