import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlowmstService } from './flowmst.service';
import { CreateFlowmstDto } from './dto/create-flowmst.dto';
import { UpdateFlowmstDto } from './dto/update-flowmst.dto';

@Controller('flowmst')
export class FlowmstController {
  constructor(private readonly flowmstService: FlowmstService) {}

  @Post()
  create(@Body() createFlowmstDto: CreateFlowmstDto) {
    return this.flowmstService.create(createFlowmstDto);
  }

  @Get()
  findAll() {
    return this.flowmstService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flowmstService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlowmstDto: UpdateFlowmstDto) {
    return this.flowmstService.update(+id, updateFlowmstDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flowmstService.remove(+id);
  }
}
