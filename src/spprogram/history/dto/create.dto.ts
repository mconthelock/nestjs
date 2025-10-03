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

  @IsNumber()
  @Type(() => Number)
  INQH_LATEST: number;

  @IsDate()
  @Type(() => Date)
  INQH_DATE: Date;

  @IsString()
  @IsOptional()
  INQH_REMARK: string;
}
