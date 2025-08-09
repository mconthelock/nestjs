import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class createAttDto {
  @IsString()
  INQ_NO: string;

  @IsString()
  @IsOptional()
  FILE_NAME?: string;

  @IsString()
  @IsOptional()
  FILE_ORIGINAL_NAME?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  FILE_SIZE?: number;

  @IsString()
  @IsOptional()
  FILE_TYPE?: string;

  @IsString()
  @IsOptional()
  FILE_CLASS?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  FILE_STATUS?: number;

  @IsString()
  @IsOptional()
  FILE_OWNER?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  FILE_MAR_READ?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  FILE_DES_READ?: number;

  @IsOptional()
  @Type(() => Date)
  FILE_CREATE_AT?: Date;

  @IsString()
  @IsOptional()
  FILE_CREATE_BY?: string;
}
