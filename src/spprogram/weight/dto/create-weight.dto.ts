import { Type } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class createWeightDto {
  @Type(() => Number)
  @IsNumber()
  INQ_ID: number;

  @Type(() => Number)
  @IsNumber()
  SEQ_WEIGHT: number;

  @Type(() => Number)
  @IsNumber()
  NO_WEIGHT: number;

  @IsString()
  @IsNotEmpty()
  PACKAGE_TYPE: string;

  @Type(() => Number)
  @IsNumber()
  NET_WEIGHT: number;

  @Type(() => Number)
  @IsNumber()
  GROSS_WEIGHT: number;

  @Type(() => Number)
  @IsNumber()
  WIDTH_WEIGHT: number;

  @Type(() => Number)
  @IsNumber()
  LENGTH_WEIGHT: number;

  @Type(() => Number)
  @IsNumber()
  HEIGHT_WEIGHT: number;

  @Type(() => Number)
  @IsNumber()
  VOLUMN_WEIGHT: number;

  @Type(() => Number)
  @IsNumber()
  ROUND_WEIGHT: number;
}
