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
  @Type(() => Date)
  @IsDate()
  SG_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  SG_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  SE_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  SE_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  SE_CONFIRM?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  DE_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  DE_CONFIRM?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  BM_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  PKC_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  PKC_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  PKC_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  FIN_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  FIN_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  FIN_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  FCK_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  FCK_READ?: Date | null;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  FCK_CONFIRM?: Date | null;

  @IsString()
  @IsOptional()
  FMN_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  FMN_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  FMN_CONFIRM?: Date;

  @IsString()
  @IsOptional()
  QT_USER?: string;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
  QT_READ?: Date;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @Type(() => Date)
  @IsDate()
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
