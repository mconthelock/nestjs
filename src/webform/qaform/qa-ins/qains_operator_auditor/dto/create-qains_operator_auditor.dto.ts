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
}
