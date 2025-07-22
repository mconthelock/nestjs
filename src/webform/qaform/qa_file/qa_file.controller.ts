import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QaFileService } from './qa_file.service';
import { CreateQaFileDto } from './dto/create-qa_file.dto';
import { UpdateQaFileDto } from './dto/update-qa_file.dto';

@Controller('qa-file')
export class QaFileController {
  constructor(private readonly qaFileService: QaFileService) {}

  @Post()
  create(@Body() createQaFileDto: CreateQaFileDto) {
    return this.qaFileService.create(createQaFileDto);
  }

  @Get()
  findAll() {
    return this.qaFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qaFileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQaFileDto: UpdateQaFileDto) {
    return this.qaFileService.update(+id, updateQaFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qaFileService.remove(+id);
  }
}
