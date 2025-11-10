import { Type } from 'class-transformer';
import {
    IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChemicalSectionDto {
  @IsNotEmpty()
  @IsString()
  OWNER: string;

  @IsNotEmpty()
  @IsString()
  OWNERCODE: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  AMEC_SDS_ID: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  RECEIVED_SDS_DATE : Date;

  @IsNotEmpty()
  @IsString()
  USED_FOR: string;

  @IsNotEmpty()
  @IsString()
  USED_AREA: string;

  @IsNotEmpty()
  @IsString()
  KEEPING_POINT: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  QTY: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  REC4052: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  REC4054: number;

  @IsNotEmpty()
  @IsString()
  USER_CREATE: string;
}
