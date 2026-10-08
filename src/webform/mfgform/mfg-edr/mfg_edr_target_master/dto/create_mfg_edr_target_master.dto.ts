import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateMfgEdrTargetMasterDto {
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  @Max(9999)
  FYEAR: number;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  SSECCODE: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  JAN?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  FEB?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  MAR?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  APR?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  MAY?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  JUN?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  JUL?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  AUG?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  SEP?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  OCT?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  NOV?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  DEC?: number;
}