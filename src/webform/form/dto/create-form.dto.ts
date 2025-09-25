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
  REQBY: string;

  @IsNotEmpty()
  @IsString()
  INPUTBY: string;

  @IsOptional()
  @IsString()
  REMARK?: string;

  @IsOptional()
  @IsString()
  DRAFT?: string;
}
