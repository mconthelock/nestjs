import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { FormDto } from './form.dto';
import { PickType } from '@nestjs/mapped-types';

export class CreateFormDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
]) {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  REQBY: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  INPUTBY: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  REMARK?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  DRAFT?: string;
}
