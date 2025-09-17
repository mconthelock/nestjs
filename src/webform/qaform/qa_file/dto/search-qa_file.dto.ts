import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';
export class SearchQaFileDto {
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

  @IsString()
  FILE_TYPECODE: string;


  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  FILE_ID?: number;

  @IsOptional()
  @IsString()
  FILE_ONAME?: string;

  @IsOptional()
  @IsString()
  FILE_FNAME?: string;

  @IsOptional()
  @IsString()
  FILE_USERCREATE?: string;

  @IsOptional()
  @IsString()
  FILE_USERUPDATE?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  FILE_STATUS?: number;

  @IsOptional()
  @IsString()
  FILE_PATH?: string;
}
