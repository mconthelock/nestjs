import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { createTimelineDto } from './create-dto';

export class updateTimelineDto extends PartialType(createTimelineDto) {
  @IsString()
  @IsOptional()
  SG_USER: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  SG_READ: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  SG_CONFIIRM: Date;

  @IsString()
  @IsOptional()
  SE_USER: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  SE_READ: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  SE_CONFIIRM: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  DE_READ: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  DE_CONFIRM: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  BM_COFIRM: Date;

  @IsString()
  @IsOptional()
  PKC_USER: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  PKC_READ: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  PKC_CONFIRM: Date;

  @IsString()
  @IsOptional()
  FIN_USER: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  FIN_READ: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  FIN_CONFIRM: Date;

  @IsString()
  @IsOptional()
  FCK_USER: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  FCK_READ: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  FCK_CONFIRM: Date;

  @IsString()
  @IsOptional()
  FMN_USER: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  FMN_READ: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  FMN_CONFIRM: Date;

  @IsString()
  @IsOptional()
  QT_USER: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  QT_READ: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  QT_CONFIRM: Date;

  @IsString()
  @IsOptional()
  BYPASS_SE: string;

  @IsString()
  @IsOptional()
  BYPASS_DE: string;

  @IsString()
  @IsOptional()
  SALE_CLASS: string;
}
