import { Type, Transform } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

const setTransformDate = (value) => {
  console.log('Transforming value:', value);
  if (value == null || value == undefined || value == '') {
    return null;
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

export class createGroupDto {
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
  @Transform(({ value }) => setTransformDate(value))
  @IsDate()
  INQG_ASG_DATE?: Date | null;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @IsDate()
  INQG_DES_DATE?: Date | null;

  @IsOptional()
  @Transform(({ value }) => setTransformDate(value))
  @IsDate()
  INQG_CHK_DATE?: Date | null;

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
