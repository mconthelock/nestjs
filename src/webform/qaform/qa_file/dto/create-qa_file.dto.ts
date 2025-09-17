import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';
export class CreateQaFileDto {
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


  @IsString()
  FILE_ONAME: string;

  @IsString()
  FILE_FNAME: string;

  @IsString()
  FILE_USERCREATE: string;

  @IsString()
  FILE_PATH: string;
}
