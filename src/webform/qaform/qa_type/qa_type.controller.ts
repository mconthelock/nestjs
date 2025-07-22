import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QaTypeService } from './qa_type.service';
import { CreateQaTypeDto } from './dto/create-qa_type.dto';
import { UpdateQaTypeDto } from './dto/update-qa_type.dto';

@Controller('qa-type')
export class QaTypeController {
  constructor(private readonly qaTypeService: QaTypeService) {}

  @Post()
  create(@Body() createQaTypeDto: CreateQaTypeDto) {
    return this.qaTypeService.create(createQaTypeDto);
  }

  @Get()
  findAll() {
    return this.qaTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qaTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQaTypeDto: UpdateQaTypeDto) {
    return this.qaTypeService.update(+id, updateQaTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qaTypeService.remove(+id);
  }
}
