import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatrixAdsService } from './matrix-ads.service';
import { CreateMatrixAdDto } from './dto/create-matrix-ad.dto';
import { UpdateMatrixAdDto } from './dto/update-matrix-ad.dto';

@Controller('matrix/ads')
export class MatrixAdsController {
  constructor(private readonly matrixAdsService: MatrixAdsService) {}

  @Post('insert')
  create(@Body() createMatrixAdDto: CreateMatrixAdDto) {
    return this.matrixAdsService.create(createMatrixAdDto);
  }

  @Get()
  findAll() {
    return this.matrixAdsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matrixAdsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matrixAdsService.remove(+id);
  }
}
