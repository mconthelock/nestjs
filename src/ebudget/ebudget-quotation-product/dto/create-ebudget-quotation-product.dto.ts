import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEbudgetQuotationProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  QUOTATION_ID: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  SEQ: number;

  @IsNotEmpty()
  @IsString()
  SVENDCODE: string;

  @IsNotEmpty()
  @IsString()
  SVENDNAME: string;

  @IsNotEmpty()
  @IsString()
  PRODCODE: string;

  @IsNotEmpty()
  @IsString()
  PRODNAME: string;

  @IsNotEmpty()
  @IsString()
  UNITCODE: string;

  @IsNotEmpty()
  @IsString()
  UNIT: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  QTY: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  PRICE: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  CURRENCY: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  TOTAL: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  CURRYEAR: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  CURRSECT: number;

  @IsNotEmpty()
  @IsString()
  CURRCODE: string;
}
