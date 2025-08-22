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
  readonly NFRMNO: number;

  @IsNotEmpty()
  @IsString()
  readonly VORGNO: string;

  @IsNotEmpty()
  @IsString()
  readonly CYEAR: string;

  @IsNotEmpty()
  @IsString()
  readonly CYEAR2: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly NRUNNO: number;
}
