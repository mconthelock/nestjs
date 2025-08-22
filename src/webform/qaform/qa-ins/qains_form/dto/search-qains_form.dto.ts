import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';
export class SearchQainsFormDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  NFRMNO?: number;

  @IsOptional()
  @IsString()
  VORGNO?: string;

  @IsOptional()
  @IsString()
  CYEAR?: string;

  @IsOptional()
  @IsString()
  CYEAR2?: string;

  @IsOptional()
  @Type(() => Number)
  NRUNNO?: number;

  @IsOptional()
  @IsString()
  QA_ITEM?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  QA_INCHARGE_SECTION?: number;

  @IsOptional()
  @IsString()
  QA_INCHARGE_EMPNO?: string;
}
