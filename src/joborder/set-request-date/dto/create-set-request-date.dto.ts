import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
export class UpsertSetRequestDateDto {
    
  @IsNotEmpty()
  @IsString()
  MFGNO: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  PONO: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  LINENO: number;

  @IsNotEmpty()
  @IsString()
  REQUESTDATE: string;

  @IsOptional()
  @IsString()
  REMARK: string;

  @IsNotEmpty()
  @IsString()
  ACTION_BY: string;
}
