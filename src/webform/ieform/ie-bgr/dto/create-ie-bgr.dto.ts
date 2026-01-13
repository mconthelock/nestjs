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

export class CreateIeBgrDto {
  @IsNotEmpty()
  @IsString()
  empInput: string;

  @IsNotEmpty()
  @IsString()
  empRequest: string;

  @IsOptional()
  @IsString()
  remark: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  PREDATE: Date;

  @IsNotEmpty()
  @IsString()
  BGTYPE: string;

  @IsNotEmpty()
  @IsString()
  FYEAR: string;

  @IsNotEmpty()
  @IsString()
  SN: string;

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

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BGRQuotationDto)
  quotation: BGRQuotationDto[];
}

export class BGRQuotationDto {
  @IsNotEmpty()
  @IsString()
  QTA_FORM: string;

  @IsNotEmpty()
  @IsString()
  QTA_VALID_DATE: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  TOTAL: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BGRQuotationProductDto)
  product?: BGRQuotationProductDto[];
}

export class BGRQuotationProductDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  SEQ: number;

  @IsNotEmpty()
  @IsString()
  SVENDCODE: string;

  @IsNotEmpty()
  @IsString()
  SVENDNAME: string;

  @IsNotEmpty()
  @IsString()
  PRODCODE: string;

  @IsNotEmpty()
  @IsString()
  PRODNAME: string;

  @IsNotEmpty()
  @IsString()
  UNITCODE: string;

  @IsNotEmpty()
  @IsString()
  UNIT: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  QTY: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  PRICE: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  CURRENCY: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  TOTAL: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  CURRYEAR: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  CURRSECT: number;

  @IsNotEmpty()
  @IsString()
  CURRCODE: string;
}
