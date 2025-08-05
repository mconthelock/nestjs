import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class createDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQG_ID?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQ_ID: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQG_GROUP: number;

  @IsString()
  @IsOptional()
  INQG_REV: string;

  @IsString()
  @IsOptional()
  INQG_ASG?: string;

  @IsString()
  @IsOptional()
  INQG_DES?: string;

  @IsString()
  @IsOptional()
  INQG_CHK?: string;

  @IsString()
  @IsOptional()
  INQG_CLASS?: string;

  @IsOptional()
  @Type(() => Date)
  INQG_ASG_DATE?: Date;

  @IsOptional()
  @Type(() => Date)
  INQG_DES_DATE?: Date;

  @IsOptional()
  @Type(() => Date)
  INQG_CHK_DATE?: Date;

  @IsString()
  @IsOptional()
  INQG_DES_REASON?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQG_STATUS: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQG_LATEST: number;

  @IsString()
  @IsOptional()
  IS_MAIL?: string;
}
