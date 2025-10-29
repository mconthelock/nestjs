// prettier-ignore
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatrixItemMasterService } from './matrix-item-master.service';
// prettier-ignore
import { CreateMatrixItemMasterDto, MigrationMatrixItemMasterDto } from './dto/create-matrix-item-master.dto';
import { UpdateMatrixItemMasterDto } from './dto/update-matrix-item-master.dto';

@Controller('matrix/master')
export class MatrixItemMasterController {
  constructor(private readonly mtm: MatrixItemMasterService) {}

  @Post('migration')
  async migration(@Body() dto: MigrationMatrixItemMasterDto) {
    return await this.mtm.migration(dto);
  }

  @Post('getMaster')
  async getMaster(@Body() dto: UpdateMatrixItemMasterDto) {
    return await this.mtm.getMaster(dto);
  }
}
