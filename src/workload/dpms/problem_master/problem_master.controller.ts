import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProblemMasterService } from './problem_master.service';
import { CreateProblemMasterDto } from './dto/create-problem_master.dto';
import { UpdateProblemMasterDto } from './dto/update-problem_master.dto';

@Controller('problem-master')
export class ProblemMasterController {
  constructor(private readonly problemMasterService: ProblemMasterService) {}

  @Post()
  create(@Body() createProblemMasterDto: CreateProblemMasterDto) {
    return this.problemMasterService.create(createProblemMasterDto);
  }

  @Get()
  findAll() {
    return this.problemMasterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemMasterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProblemMasterDto: UpdateProblemMasterDto) {
    return this.problemMasterService.update(+id, updateProblemMasterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.problemMasterService.remove(+id);
  }
}
