import { PartialType } from '@nestjs/swagger';
import { CreateFormDto } from './create-form.dto';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  isNotEmpty,
} from 'class-validator';

export class UpdateFormDto extends PartialType(CreateFormDto) {
  @IsOptional()
  @IsString()
  readonly CST?: string;

  @IsOptional()
  condition?: any;

  @IsOptional()
  @IsString()
  readonly CYEAR2?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly NRUNNO?: number;
}
