import { PartialType } from '@nestjs/swagger';
import { CreateOrdermainDto } from './create-ordermain.dto';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SearchOrdermainDto {
  @IsOptional()
  @IsString()
  SERIES: string;

  @IsOptional()
  @IsString()
  AGENT: string;

  @IsOptional()
  @IsString()
  PRJ_NO: string;

  @IsOptional()
  @IsString()
  ORDER_NO: string;

  @IsOptional()
  @IsString()
  MFGNO: string;

  @IsOptional()
  @IsString()
  IDS_DATE: string;

  @IsOptional()
  @IsString()
  EDIT_DATE: string;

  @IsOptional()
  @IsString()
  CAR_NO: string;

  @IsOptional()
  @IsString()
  SMFGNO: string;
}
