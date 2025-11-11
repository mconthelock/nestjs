import { PartialType } from '@nestjs/swagger';
import { CreateMatrixItemMasterDto } from './create-matrix-item-master.dto';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMatrixItemMasterDto extends PartialType(
  CreateMatrixItemMasterDto,
) {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ID: number;

  @IsNotEmpty()
  @IsString()
  USERUPDATE: string;
}

export class getMatrixItemMasterDto extends PartialType(
  CreateMatrixItemMasterDto,
) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ID: number;
}
