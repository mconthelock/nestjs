import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderpartDto {
  @IsOptional()
  @IsString()
  SERIES?: string;

  @IsOptional()
  @IsString()
  AGENT?: string;

  @IsOptional()
  @IsString()
  PRJ_NO?: string;

  @IsOptional()
  @IsString()
  ORDER_NO?: string;

  @IsOptional()
  @IsString()
  MFGNO?: string;

  @IsOptional()
  @IsString()
  IDS_DATE?: string;

  @IsOptional()
  @IsString()
  EDIT_DATE?: string;

  @IsOptional()
  @IsString()
  CAR_NO?: string;

  @IsOptional()
  @IsString()
  RECON_PARTS?: string;
}
