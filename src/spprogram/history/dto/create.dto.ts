import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class createDto {
  @IsString()
  @IsOptional()
  INQ_NO: string;

  @IsString()
  @IsOptional()
  INQ_REV: string;

  @IsString()
  @IsOptional()
  INQH_USER: string;

  @IsNumber()
  @Type(() => Number)
  INQH_ACTION: number;

  @IsString()
  @IsOptional()
  INQH_REMARK: string;
}
