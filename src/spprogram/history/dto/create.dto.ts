import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class createDto {
  @IsString()
  INQ_NO: string;

  @IsString()
  INQ_REV: string;

  @IsDate()
  @Type(() => Date)
  INQH_DATE: Date;

  @IsString()
  INQH_USER: string;

  @IsNumber()
  @Type(() => Number)
  INQH_ACTION: number;

  @IsString()
  @IsOptional()
  INQH_REMARK: string;
}
