import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMfgDrawingDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NBLOCKID: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NITEMID: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VPIS?: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VDRAWING: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NINSPECTOR_STATUS: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NFORELEAD_STATUS: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VFILE_NAME: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NUSERCREATE: number;
}

export class CreateMfgDrawingCheckSheetDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NBLOCKID: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NITEMID: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VPIS?: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  ASERIALNO: string[];

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NUSERCREATE: number;
}
