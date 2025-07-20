import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';
export class updateDto {
  @Type(() => Number)
  @IsNumber()
  CURR_YEAR: number;

  @Type(() => Number)
  @IsNumber()
  CURR_PERIOD: number;

  @IsString()
  @IsNotEmpty()
  CURR_CODE: string;

  @Type(() => Number)
  @IsNumber()
  CURR_RATE: number;

  @IsDate()
  @Type(() => Date)
  CURR_UPDATE_DATE: Date;

  @IsString()
  CURR_UPDATE_BY: string;
}
