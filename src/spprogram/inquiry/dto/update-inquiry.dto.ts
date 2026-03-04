import { Type } from 'class-transformer';
import { IsNumber, IsIn, IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { createInqDto } from './create-inquiry.dto';

export class updateInqDto extends PartialType(createInqDto) {
  @IsNumber()
  @Type(() => Number)
  @IsIn([0, 1])
  INQ_LATEST: number;

  @IsNumber()
  @Type(() => Number)
  @IsIn([0, 1])
  @IsOptional()
  INQ_SALE_FORWARD?: number;

  @IsString()
  @IsOptional()
  INQ_SALE_REMARK?: string;

  @IsString()
  @IsOptional()
  INQ_DE_REMARK?: string;

  @IsString()
  @IsOptional()
  INQ_FIN_REMARK?: string;
}
