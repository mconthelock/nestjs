import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkpicService } from './workpic.service';
import { CreateWorkpicDto } from './dto/create-workpic.dto';
import { UpdateWorkpicDto } from './dto/update-workpic.dto';

@Controller('workpic')
export class WorkpicController {
  constructor(private readonly workpicService: WorkpicService) {}

  @Post()
  create(@Body() createWorkpicDto: CreateWorkpicDto) {
    return this.workpicService.create(createWorkpicDto);
  }

  @Get()
  findAll() {
    return this.workpicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workpicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkpicDto: UpdateWorkpicDto) {
    return this.workpicService.update(+id, updateWorkpicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workpicService.remove(+id);
  }
}
