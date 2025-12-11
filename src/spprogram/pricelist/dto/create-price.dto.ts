import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';

export class createPriceListDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  FYYEAR: number;

  @IsString()
  @IsNotEmpty()
  PERIOD: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  ITEM: number;

  @IsString()
  STATUS: string;

  @Type(() => Date)
  @IsDate()
  STARTIN: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  INQUIRY: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  FCCOST: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  FCBASE: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  TCCOST: number;

  @IsString()
  LATEST: string;

  @Type(() => Date)
  @IsDate()
  CREATE_AT: Date;

  @IsString()
  CREATE_BY: string;
}
