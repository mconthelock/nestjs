import { Type, Transform } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { createTimelineDto } from './create-dto';

const setTransformDate = (value) => {
  console.log('Transforming value:', value);
  if (value == null || value == undefined || value == '') {
    return null;
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

export class updateTimelineDto extends PartialType(createTimelineDto) {
  @IsString()
  @IsOptional()
  SG_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  SG_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  SG_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  SE_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  SE_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  SE_CONFIRM?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  DE_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  DE_CONFIRM?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  BM_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  PKC_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  PKC_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  PKC_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  FIN_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  FIN_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  FIN_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  FCK_USER?: string;

  @Transform(({ value }) => setTransformDate(value))
  @IsOptional()
  //   @IsDate()
  FCK_READ?: Date | null;

  @Transform(({ value }) => setTransformDate(value))
  @IsOptional()
  FCK_CONFIRM: Date | null;

  @IsString()
  @IsOptional()
  FMN_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  FMN_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  FMN_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  QT_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  QT_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  QT_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  BYPASS_SE?: string;

  @IsString()
  @IsOptional()
  BYPASS_DE?: string;

  @IsString()
  @IsOptional()
  SALE_CLASS?: string;
}
