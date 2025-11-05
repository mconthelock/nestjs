import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateMatrixItemMasterDto {
  @IsNotEmpty()
  @IsString()
  ITEMNO: string;

  @IsNotEmpty()
  @IsString()
  TITLE: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  SECID: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  STATUS?: number;
}

export class MigrationMatrixItemMasterDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatrixItemMasterDto)
  data: CreateMatrixItemMasterDto[];
}
