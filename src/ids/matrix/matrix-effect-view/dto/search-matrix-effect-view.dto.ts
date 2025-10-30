import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SearchMatrixEffectViewDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  SECID: number;

  @IsOptional()
  @IsString()
  ITEMNO: string;

  @IsOptional()
  @IsString()
  TITLE: string;
}

