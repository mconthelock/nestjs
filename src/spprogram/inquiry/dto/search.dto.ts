import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { createInqDto } from './create-inquiry.dto';

export class searchDto extends PartialType(createInqDto) {
  @IsString()
  @IsOptional()
  INQ_MAR_REMARK: string;
}
