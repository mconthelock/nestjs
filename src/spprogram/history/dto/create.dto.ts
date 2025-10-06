import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class createHistoryDto {
  @IsString()
  INQ_NO: string;

  @IsString()
  INQ_REV: string;

  @IsString()
  INQH_USER: string;

  @IsNumber()
  @Type(() => Number)
  INQH_ACTION: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  INQH_DATE: Date;

  @IsNumber()
  @Type(() => Number)
  INQH_LATEST: number;

  @IsString()
  @IsOptional()
  INQH_REMARK: string;
}
