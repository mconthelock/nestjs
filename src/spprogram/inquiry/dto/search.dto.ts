import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { createInqDto } from './create-inquiry.dto';

export class searchDto extends PartialType(createInqDto) {
  @IsString()
  @IsOptional()
  INQ_MAR_REMARK: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  LE_INQ_STATUS: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  GE_INQ_STATUS: number;
}
