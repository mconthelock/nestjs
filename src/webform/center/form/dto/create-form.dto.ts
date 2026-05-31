import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsDate,
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

export class FormWebformDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VREQNO: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VINPUTER: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VREMARK?: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    DREQDATE: Date;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CREQTIME: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CST: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VFORMPAGE: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VREMOTE: string;
}

export class GetNextRunNoDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
] as const) {}