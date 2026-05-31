import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import { FormDto } from './form.dto';

export class empnoFormDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly EMPNO?: string;
}
