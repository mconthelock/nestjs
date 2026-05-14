import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMfgEdrDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  NFRMNO: number;

  @IsString()
  @IsNotEmpty()
  VORGNO: string;

  @IsString()
  @IsNotEmpty()
  CYEAR: string;

  @IsString()
  @IsNotEmpty()
  CYEAR2: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  NRUNNO: number;
}