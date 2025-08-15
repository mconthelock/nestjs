import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';
export class SearchQainsOADto {
  @Type(() => Number)
  @IsNumber()
  NFRMNO: number;

  @IsString()
  VORGNO: string;

  @IsString()
  CYEAR: string;

  @IsString()
  CYEAR2: string;

  @Type(() => Number)
  @IsNumber()
  NRUNNO: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  QOA_SEQ?: number;

  @IsOptional()
  @IsString()
  QOA_EMPNO?: string;

  @IsOptional()
  @IsString()
  QOA_TYPECODE?: string;
}
