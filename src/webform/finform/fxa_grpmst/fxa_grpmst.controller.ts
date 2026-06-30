import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FxaGrpmstService } from './fxa_grpmst.service';
import { CreateFxaGrpmstDto } from './dto/create-fxa_grpmst.dto';
import { UpdateFxaGrpmstDto } from './dto/update-fxa_grpmst.dto';

@Controller('finform/fxa-grpmst')
export class FxaGrpmstController {
  constructor(private readonly fxaGrpmstService: FxaGrpmstService) {}

  @Post()
  create(@Body() createFxaGrpmstDto: CreateFxaGrpmstDto) {
    return this.fxaGrpmstService.create(createFxaGrpmstDto);
  }

  @Get()
  findAll() {
    return this.fxaGrpmstService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fxaGrpmstService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFxaGrpmstDto: UpdateFxaGrpmstDto) {
    return this.fxaGrpmstService.update(+id, updateFxaGrpmstDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fxaGrpmstService.remove(+id);
  }
}
