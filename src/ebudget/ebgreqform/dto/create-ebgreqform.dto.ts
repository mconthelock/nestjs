import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateEbgreqformDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsOptional()
  @IsString()
  ID?: string;

  @IsOptional()
  @IsString()
  FYEAR?: string;

  @IsOptional()
  @IsString()
  SCATALOG?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  RECBG?: number;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  USEDBG?: number;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  REMBG?: number;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  REQAMT?: number;

  @IsOptional()
  @IsString()
  RESORG?: string;

  @IsOptional()
  @IsString()
  PIC?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  FINDATE?: Date;

  @IsOptional()
  @IsString()
  ITMNAME?: string;

  @IsOptional()
  @IsString()
  PURPOSE?: string;

  @IsOptional()
  @IsString()
  DETPLAN?: string;

  @IsOptional()
  @IsString()
  INVDET?: string;

  @IsOptional()
  @IsString()
  EFFT?: string;

  @IsOptional()
  @IsString()
  SCHEDULE?: string;

  @IsOptional()
  @IsString()
  REMARK?: string;

  @IsOptional()
  @IsString()
  GPBID?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  PPRESDATE?: Date;

  @IsOptional()
  @IsString()
  CASETYPE: string;
}
