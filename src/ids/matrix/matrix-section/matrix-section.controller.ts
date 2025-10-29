import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatrixSectionService } from './matrix-section.service';
import { CreateMatrixSectionDto } from './dto/create-matrix-section.dto';
import { UpdateMatrixSectionDto } from './dto/update-matrix-section.dto';

@Controller('matrix/section')
export class MatrixSectionController {
  constructor(private readonly matrixSectionService: MatrixSectionService) {}

  @Get()
  async findAll() {
    return await this.matrixSectionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.matrixSectionService.findOne(+id);
  }

}
