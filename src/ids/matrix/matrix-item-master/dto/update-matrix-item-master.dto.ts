import { PartialType } from '@nestjs/swagger';
import { CreateMatrixItemMasterDto } from './create-matrix-item-master.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMatrixItemMasterDto extends PartialType(
  CreateMatrixItemMasterDto,
) {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ID: number;
}

export class getMatrixItemMasterDto extends PartialType(
  CreateMatrixItemMasterDto,
) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ID: number;
}
