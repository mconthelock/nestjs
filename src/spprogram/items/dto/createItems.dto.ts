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
  @IsNumber()
  ITEM_ID: number;

  @IsString()
  ITEM_NO: string;

  @IsString()
  ITEM_NAME: string;

  @IsString()
  ITEM_DWG: string;

  @IsString()
  ITEM_VARIABLE: string;

  @IsNumber()
  ITEM_TYPE: number;

  @IsString()
  ITEM_CLASS: string;

  @IsString()
  ITEM_UNIT: string;

  @IsString()
  ITEM_SUPPLIER: string;

  @IsNumber()
  CATEGORY: number;

  @IsString()
  ITEM_REMARK: string;
}
