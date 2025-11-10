// prettier-ignore
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatrixItemMasterService } from './matrix-item-master.service';
// prettier-ignore
import { CreateMatrixItemMasterDto, MigrationMatrixItemMasterDto } from './dto/create-matrix-item-master.dto';
import { getMatrixItemMasterDto, UpdateMatrixItemMasterDto } from './dto/update-matrix-item-master.dto';
@Controller('matrix/master')
export class MatrixItemMasterController {
  constructor(private readonly mtm: MatrixItemMasterService) {}

  @Post('migration')
  async migration(@Body() dto: MigrationMatrixItemMasterDto) {
    return await this.mtm.migration(dto);
  }

  @Post('getMaster')
  async getMaster(@Body() dto: getMatrixItemMasterDto) {
    return await this.mtm.getMaster(dto);
  }

  @Post('insert')
  async insert(@Body() dto: CreateMatrixItemMasterDto) {
    return await this.mtm.insert(dto);
  }

  @Patch('update')
  async update(@Body() dto: UpdateMatrixItemMasterDto) {
    return await this.mtm.update(dto);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.mtm.delete(+id);
  }
}
