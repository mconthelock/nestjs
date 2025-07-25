import { PartialType } from '@nestjs/mapped-types';
import { UpsertSetRequestDateDto } from './create-set-request-date.dto';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSetRequestDateDto extends PartialType(
  UpsertSetRequestDateDto,
) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  REVISION: number;

  @IsOptional()
  @IsString()
  PUR_STATUS: string;

  @IsOptional()
  @IsString()
  CONFIRMDATE?: string;

  @IsOptional()
  @IsString()
  PUR_REMARK?: string;

}
