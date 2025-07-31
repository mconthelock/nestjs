import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class createDto {
  @IsNumber()
  @IsOptional()
  INQ_ID: number;

  @IsString()
  @IsOptional()
  INQ_NO: string;

  @IsString()
  @IsOptional()
  INQ_REV: string;

  @IsNumber()
  @IsOptional()
  INQ_STATUS: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  INQ_DATE: Date;

  @IsString()
  @IsOptional()
  INQ_TRADER: string;

  @IsString()
  @IsOptional()
  INQ_AGENT: string;

  @IsString()
  @IsOptional()
  INQ_COUNTRY: string;

  @IsString()
  @IsOptional()
  INQ_TYPE: string;

  @IsString()
  @IsOptional()
  INQ_PRJNO: string;

  @IsString()
  @IsOptional()
  INQ_PRJNAME: string;

  @IsString()
  @IsOptional()
  INQ_SHOPORDER: string;

  @IsString()
  @IsOptional()
  INQ_SERIES: string;

  @IsString()
  @IsOptional()
  INQ_OPERATION: string;

  @IsString()
  @IsOptional()
  INQ_SPEC: string;

  @IsString()
  @IsOptional()
  INQ_PRDSCH: string;

  @IsNumber()
  @IsOptional()
  INQ_QUOTATION_TYPE: number;

  @IsNumber()
  @IsOptional()
  INQ_DELIVERY_TERM: number;

  @IsNumber()
  @IsOptional()
  INQ_DELIVERY_METHOD: number;

  @IsNumber()
  @IsOptional()
  INQ_SHIPMENT: number;

  @IsString()
  @IsOptional()
  INQ_MAR_PIC: string;

  @IsString()
  @IsOptional()
  INQ_FIN_PIC: string;

  @IsString()
  @IsOptional()
  INQ_PKC: string;
}
