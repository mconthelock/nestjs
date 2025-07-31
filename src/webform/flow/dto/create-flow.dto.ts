import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class CreateFlowDto {
  @IsNumber()
  @Type(() => Number)
  NFRMNO: number;

  @IsString()
  VORGNO: string;

  @IsString()
  CYEAR: string;

  @IsString()
  CYEAR2: string;

  @IsNumber()
  @Type(() => Number)
  NRUNNO: number;

  @IsOptional()
  @IsString()
  CSTEPNO?: string;

  @IsOptional()
  @IsString()
  CSTEPNEXTNO?: string;

  @IsOptional()
  @IsString()
  CSTART?: string;

  @IsOptional()
  @IsString()
  CSTEPST?: string;

  @IsOptional()
  @IsString()
  CTYPE?: string;

  @IsOptional()
  @IsString()
  VPOSNO?: string;

  @IsOptional()
  @IsString()
  VAPVNO?: string;

  @IsOptional()
  @IsString()
  VREPNO?: string;

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

  @IsOptional()
  @IsString()
  VURL?: string;

  @IsOptional()
  @IsString()
  VREMARK?: string;

  @IsOptional()
  @IsString()
  VREMOTE?: string;
}
