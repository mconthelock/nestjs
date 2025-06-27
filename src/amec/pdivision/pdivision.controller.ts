import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PdivisionService } from './pdivision.service';
import { CreatePdivisionDto } from './dto/create-pdivision.dto';
import { UpdatePdivisionDto } from './dto/update-pdivision.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('amec/division')
export class PdivisionController {
  constructor(private readonly pdivisionService: PdivisionService) {}

  @Post()
  create(@Body() createPdivisionDto: CreatePdivisionDto) {
    return this.pdivisionService.create(createPdivisionDto);
  }

  @Get()
  findAll() {
    return this.pdivisionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pdivisionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePdivisionDto: UpdatePdivisionDto,
  ) {
    return this.pdivisionService.update(+id, updatePdivisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdivisionService.remove(+id);
  }
}
