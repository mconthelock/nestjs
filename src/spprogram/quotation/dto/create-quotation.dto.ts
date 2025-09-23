import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class createQuotationDto {
  @IsNumber()
  @IsOptional()
  QUO_ID?: number;

  @IsNumber()
  @Type(() => Number)
  QUO_INQ: number;

  @IsString()
  QUO_REV: string;

  @IsDate()
  @Type(() => Date)
  QUO_DATE: Date;

  @IsDate()
  @Type(() => Date)
  QUO_VALIDITY: Date;

  @IsString()
  QUO_PIC: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  QUO_SEA_FREIGHT?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  QUO_SEA_VOLUMN?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  QUO_SEA_TOTAL?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  QUO_AIR_FREIGHT?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  QUO_AIR_VOLUMN?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  QUO_AIR_TOTAL?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  QUO_COURIER_FREIGHT?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  QUO_COURIER_VOLUMN?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  QUO_COURIER_TOTAL?: number;

  @IsString()
  @IsOptional()
  QUO_NOTE?: string;
}
