import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateMatrixManualDto } from './dto/create-matrix-manual.dto';
import { UpdateMatrixManualDto } from './dto/update-matrix-manual.dto';
import { MatrixManualService } from './matrix-manual.service';

@Controller('matrix/manual')
export class MatrixManualController {
  constructor(private readonly matrixManualService: MatrixManualService) {}

  @Post('insert')
  async insert(@Body() createMatrixManualDto: CreateMatrixManualDto) {
    return await this.matrixManualService.insert(createMatrixManualDto);
  }

  @Patch('update')
  async update(@Body() updateMatrixManualDto: UpdateMatrixManualDto) {
    return await this.matrixManualService.update(updateMatrixManualDto);
  }

  @Get()
  findAll() {
    return this.matrixManualService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matrixManualService.findOne(+id);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.matrixManualService.delete(+id);
  }
}
