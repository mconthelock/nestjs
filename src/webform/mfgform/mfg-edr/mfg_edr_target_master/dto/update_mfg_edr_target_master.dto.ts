import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateMfgEdrTargetMasterDto {
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