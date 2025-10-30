import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatrixEffectItemService } from './matrix-effect-item.service';
import { CreateMatrixEffectItemDto, MigrationMatrixItemEffectDto } from './dto/create-matrix-effect-item.dto';
import { UpdateMatrixEffectItemDto } from './dto/update-matrix-effect-item.dto';

@Controller('matrix/effect')
export class MatrixEffectItemController {
  constructor(
    private readonly mte: MatrixEffectItemService,
  ) {}

  @Post('migration')
  async migration(@Body() dto: MigrationMatrixItemEffectDto) {
    return this.mte.migration(dto);
  }
}
