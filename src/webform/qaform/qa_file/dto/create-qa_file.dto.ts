import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
export class CreateQaFileDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  NFRMNO: number;

  @IsNotEmpty()
  @IsString()
  VORGNO: string;

  @IsNotEmpty()
  @IsString()
  CYEAR: string;

  @IsNotEmpty()
  @IsString()
  CYEAR2: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  NRUNNO: number;

  @IsNotEmpty()
  @IsString()
  FILE_TYPECODE: string;

  @IsNotEmpty()
  @IsString()
  FILE_ONAME: string;

  @IsNotEmpty()
  @IsString()
  FILE_FNAME: string;

  @IsNotEmpty()
  @IsString()
  FILE_USERCREATE: string;

  @IsNotEmpty()
  @IsString()
  FILE_PATH: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  FILE_EXTRA_KEY1?: number;

  @IsOptional()
  @IsString()
  FILE_EXTRA_KEY2?: string;
}
