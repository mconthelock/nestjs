import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';
export class CreateQainsOADto {
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
  @IsString()
  QOA_EMPNO?: string;

  @IsOptional()
  @IsString()
  QOA_TYPECODE?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  QOA_SEQ?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  QOA_AUDIT?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  QOA_RESULT?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  QOA_PERCENT?: number;

  @IsOptional()
  @IsString()
  QOA_GRADE?: string;

  @IsOptional()
  @IsString()
  QOA_AUDIT_RESULT?: string;

  @IsOptional()
  @IsString()
  QOA_IMPROVMENT_ACTIVITY?: string;

  @IsOptional()
  @IsString()
  QOA_STATION?: string;


}
