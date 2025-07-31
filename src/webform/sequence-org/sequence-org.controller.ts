import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SequenceOrgService } from './sequence-org.service';
import { CreateSequenceOrgDto } from './dto/create-sequence-org.dto';
import { UpdateSequenceOrgDto } from './dto/update-sequence-org.dto';

@Controller('sequence-org')
export class SequenceOrgController {
  constructor(private readonly sequenceOrgService: SequenceOrgService) {}

  @Post()
  create(@Body() createSequenceOrgDto: CreateSequenceOrgDto) {
    return this.sequenceOrgService.create(createSequenceOrgDto);
  }

  @Get()
  findAll() {
    return this.sequenceOrgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sequenceOrgService.findOne(+id);
  }

  @Get('manager/:empno')
  findManager(@Param('empno') empno: string) {
    return this.sequenceOrgService.getManager(empno);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSequenceOrgDto: UpdateSequenceOrgDto) {
    return this.sequenceOrgService.update(+id, updateSequenceOrgDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sequenceOrgService.remove(+id);
  }
}
