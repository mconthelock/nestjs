import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatrixEffectViewService } from './matrix-effect-view.service';
import { SearchMatrixEffectViewDto } from './dto/search-matrix-effect-view.dto';

@Controller('matrix/effect')
export class MatrixEffectViewController {
  constructor(private readonly matrixEffectViewService: MatrixEffectViewService) {}

  @Post('getEffect')
  async getEffect(@Body() dto: SearchMatrixEffectViewDto) {
    return await this.matrixEffectViewService.getEffect(dto);
  }
}
