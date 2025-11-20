import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';

export class createItemsDto {
  @IsString()
  ITEM_NO: string;

  @IsString()
  ITEM_NAME: string;

  @IsString()
  ITEM_DWG: string;

  @IsString()
  @IsOptional()
  ITEM_VARIABLE: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  ITEM_TYPE: number;

  @IsString()
  @IsOptional()
  ITEM_CLASS: string;

  @IsString()
  @IsOptional()
  ITEM_UNIT: string;

  @IsString()
  ITEM_SUPPLIER: string;

  @Type(() => Number)
  @IsNumber()
  CATEGORY: number;

  @IsString()
  @IsOptional()
  ITEM_REMARK: string;

  @IsString()
  @IsOptional()
  ITEM_CUS_PUR: string;

  @IsString()
  @IsOptional()
  ITEM_AMEC_PUR: string;

  @IsString()
  @IsOptional()
  ITEM_MODEL: string;

  @Type(() => Number)
  @IsNumber()
  ITEM_STATUS: number;

  @IsString()
  @IsOptional()
  ITEM_THUMB: string;

  @Type(() => Date)
  @IsDate()
  CREATE_AT: Date;

  @IsString()
  CREATE_BY: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  UPDATE_AT: Date;

  @IsString()
  @IsOptional()
  UPDATE_BY: string;
}
