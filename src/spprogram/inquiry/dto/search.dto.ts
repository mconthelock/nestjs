import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDate,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { createInqDto } from './create-inquiry.dto';

export class searchDto extends PartialType(createInqDto) {
  @IsString()
  @IsOptional()
  INQ_MAR_REMARK: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  LE_INQ_STATUS: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  GE_INQ_STATUS: number;

  @IsString()
  @IsOptional()
  LIKE_INQ_NO: string;

  @IsString()
  @IsOptional()
  LIKE_INQ_PRJNO: string;

  @IsString()
  @IsOptional()
  LIKE_INQ_PRJNAME: string;

  @IsString()
  @IsOptional()
  LIKE_INQ_SHOPORDER: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  GE_INQ_DATE: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  LE_INQ_DATE: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  'timeline.GE_MAR_SEND': Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  'timeline.LE_MAR_SEND': Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  'quotation.GE_QUO_DATE': Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  'quotation.LE_QUO_DATE': Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  'quotation.GE_QUO_VALIDITY': Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  'quotation.LE_QUO_VALIDITY': Date;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  'timeline.ISNULL_BM_CONFIRM': boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  'needDetail': boolean;
}
