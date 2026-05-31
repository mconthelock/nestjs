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
  @ApiProperty({ example: 13 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  NFRMNO: number;

  @ApiProperty({ example: '000101' })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VORGNO: string;

  @ApiProperty({ example: '25' })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  CYEAR: string;

  @ApiProperty({ example: '2025' })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  CYEAR2: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  NRUNNO: number;
}
