import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class CreateFlowDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
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
  @IsNumber()
  @Type(() => Number)
  NRUNNO: number;

  @IsNotEmpty()
  @IsString()
  CSTEPNO: string;

  @IsNotEmpty()
  @IsString()
  CSTEPNEXTNO: string;

  @IsNotEmpty()
  @IsString()
  CSTART: string;

  @IsNotEmpty()
  @IsString()
  CSTEPST: string;

  @IsNotEmpty()
  @IsString()
  CTYPE: string;

  @IsNotEmpty()
  @IsString()
  VPOSNO: string;

  @IsNotEmpty()
  @IsString()
  VAPVNO: string;

  @IsNotEmpty()
  @IsString()
  VREPNO: string;

  @IsOptional()
  @IsString()
  VREALAPV?: string;

  @IsOptional()
  @IsString()
  CAPVSTNO?: string;

  @IsOptional()
  DAPVDATE?: Date;

  @IsOptional()
  @IsString()
  CAPVTIME?: string;

  @IsOptional()
  @IsString()
  CEXTDATA?: string;

  @IsOptional()
  @IsString()
  CAPVTYPE?: string;

  @IsOptional()
  @IsString()
  CREJTYPE?: string;

  @IsOptional()
  @IsString()
  CAPPLYALL?: string;

  @IsNotEmpty()
  @IsString()
  VURL: string;

  @IsOptional()
  @IsString()
  VREMARK?: string;

  @IsOptional()
  @IsString()
  VREMOTE?: string;
}
