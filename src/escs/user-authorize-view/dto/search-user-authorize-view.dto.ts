import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ESCSSearchUserAuthorizeViewDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  USR_ID: number;

  @IsOptional()
  @IsString()
  USR_NO: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  USR_NAME: number;

  @IsOptional()
  @IsString()
  IT_NO: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  STATION_NO: number;

  @IsOptional()
  @IsString()
  SPOSITION: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  USR_STATUS: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  SCORE: number;

  @IsOptional()
  @IsString()
  GRADE: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TOTAL: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  PERCENT: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  REV: number;

  @IsOptional()
  @IsString()
  TEST_BY: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  TEST_DATE: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TR: number;

  @IsOptional()
  @IsString()
  SSEC: string;

  @IsOptional()
  @IsString()
  SSECCODE: string;

  @IsOptional()
  @IsString()
  SDEPT: string;

  @IsOptional()
  @IsString()
  SDEPCODE: string;

  @IsOptional()
  @IsString()
  SDIV: string;

  @IsOptional()
  @IsString()
  SDIVCODE: string;
}
