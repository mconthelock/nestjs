import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';

export class CreatePurCpmDto extends PickType(CreateFormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'REQBY',
  'INPUTBY',
  'REMARK',
] as const) {
  @IsNotEmpty()
  @IsString()
  DELIVELY: string;

  @IsNotEmpty()
  //   @IsString()
//   @IsArray()
  INVOICE_TYPE: string | string[];

  @IsOptional()
  @IsString()
  INVOICE_OTHER?: string;

  @IsOptional()
  @IsString()
  THIRD_PARTY?: string;

  @IsNotEmpty()
  @IsString()
  SUBJECT: string;

  @IsOptional()
  @IsString()
  ACCEPT_PO?: string;

  @IsOptional()
  @IsString()
  ACCEPT_SUBCON?: string;

  @IsOptional()
  @IsString()
  ACCEPT_OTHER?: string;

  @IsOptional()
  @IsString()
  QUOTATION?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  QUOTATION_DATE?: Date;

  @IsOptional()
  @IsString()
  PONO?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TOTAL_AMOUNT?: number;

  @IsOptional()
  @IsString()
  PO_SIGNBY?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  PO_SIGNDATE?: Date;

  @IsOptional()
  @IsString()
  FORM_TYPE?: string;

  @IsNotEmpty()
  @IsString()
  INVOICE_NO: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  INVOICE_AMOUNT: number;

  @IsOptional()
  @IsString()
  PERSON_INCHARGE?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  INVOICE_DATE?: Date;

  @IsNotEmpty()
  @IsString()
  PAYMENT_TYPE: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  PAYMENT_NUM?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  PAYMENT: number;

  @IsOptional()
  @IsString()
  PAYMENT_DETAIL?: string;

  @IsOptional()
//   @IsArray()
  ATTACH_TYPE: string | string[];

  @IsOptional()
  @IsString()
  ATTACH_OTHER?: string;
}

export class InsertPurCpmDto extends PickType(CreatePurCpmDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'DELIVELY',
  //   'INVOICE_TYPE',
  'INVOICE_OTHER',
  'SUBJECT',
  'ACCEPT_PO',
  'ACCEPT_SUBCON',
  'ACCEPT_OTHER',
  'QUOTATION',
  'QUOTATION_DATE',
  'PONO',
  'TOTAL_AMOUNT',
  'PO_SIGNBY',
  'PO_SIGNDATE',
  'FORM_TYPE',
  'INVOICE_NO',
  'INVOICE_AMOUNT',
  'PERSON_INCHARGE',
  'INVOICE_DATE',
  'PAYMENT_TYPE',
  'PAYMENT_NUM',
  'PAYMENT',
  'ATTACH_OTHER',
] as const) {
  @IsNotEmpty()
  @IsString()
  INVOICE_TYPE: string;

  @IsOptional()
  @IsString()
  ATTACH_TYPE?: string;

  @IsNotEmpty()
  @IsString()
  CYEAR2: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NRUNNO: number;
}
