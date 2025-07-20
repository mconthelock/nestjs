import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class createDto {
  @Type(() => Number)
  @IsNumber()
  ID: number;

  @IsString()
  @IsNotEmpty()
  TRADER: string;

  @IsString()
  @IsNotEmpty()
  SUPPLIER: string;

  @Type(() => Number)
  @IsNumber()
  QUOTATION: number;

  @Type(() => Number)
  @IsNumber()
  FORMULA: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  FREIGHT_SEA: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  FREIGHT_AIR: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  FREIGHT_COURIER: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  FREIGHT_RAIL: number;

  @IsString()
  @IsOptional()
  UPDATE_BY: string;

  @Type(() => Date)
  UPDATE_AT: Date;

  @IsString()
  @IsNotEmpty()
  CURRENCY: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  STATUS: number;
}
