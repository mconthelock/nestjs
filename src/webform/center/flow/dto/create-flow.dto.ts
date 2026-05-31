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
  @Type(() => String)
  VORGNO: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  CYEAR: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  CYEAR2: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NRUNNO: number;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  CSTEPNO: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  CSTEPNEXTNO: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  CSTART: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  CSTEPST: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  CTYPE: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VPOSNO: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VAPVNO: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VREPNO: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VREALAPV?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  CAPVSTNO?: string;

  @IsOptional()
  DAPVDATE?: Date;

  @IsOptional()
  @IsString()
  @Type(() => String)
  CAPVTIME?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  CEXTDATA?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  CAPVTYPE?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  CREJTYPE?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  CAPPLYALL?: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VURL: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VREMARK?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VREMOTE?: string;
}
