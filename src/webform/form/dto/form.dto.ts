import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class FormDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  NFRMNO: number;

  @IsNotEmpty()
  @IsString()
  VORGNO: string;

  @IsNotEmpty()
  @IsString()
  CYEAR: string;

  @IsNotEmpty()
  @IsString()
  CYEAR2: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  NRUNNO: number;
}
