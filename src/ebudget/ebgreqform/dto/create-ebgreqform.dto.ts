export class CreateEbgreqformDto {}

import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateIeBgrDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsNotEmpty()
  @IsString()
  ID: string;

  @IsNotEmpty()
  @IsString()
  FYEAR: string;

  @IsNotEmpty()
  @IsString()
  SCATALOG: string;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  RECBG: number;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  USEDBG: number;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  REMBG: number;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  REQAMT: number;

  @IsNotEmpty()
  @IsString()
  RESORG: string;

  @IsNotEmpty()
  @IsString()
  PIC: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  FINDATE: Date;

  @IsNotEmpty()
  @IsString()
  ITMNAME: string;

  @IsNotEmpty()
  @IsString()
  PURPOSE: string;

  @IsNotEmpty()
  @IsString()
  DETPLAN: string;

  @IsNotEmpty()
  @IsString()
  INVDET: string;

  @IsNotEmpty()
  @IsString()
  EFFT: string;

  @IsNotEmpty()
  @IsString()
  SCHEDULE: string;

  @IsOptional()
  @IsString()
  REMARK: string;

  @IsNotEmpty()
  @IsString()
  GPBID: string;

  @IsNotEmpty()
  @IsString()
  GPYear: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  PPRESDATE: Date;
}
