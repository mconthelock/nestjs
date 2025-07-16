import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReasonService } from './reason.service';
import { CreateReasonDto } from './dto/create-reason.dto';
import { UpdateReasonDto } from './dto/update-reason.dto';

@Controller('reason')
export class ReasonController {
  constructor(private readonly reasonService: ReasonService) {}

  @Post()
  create(@Body() createReasonDto: CreateReasonDto) {
    return this.reasonService.create(createReasonDto);
  }

  @Get()
  findAll() {
    return this.reasonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reasonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReasonDto: UpdateReasonDto) {
    return this.reasonService.update(+id, updateReasonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reasonService.remove(+id);
  }
}
