import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchFlowDto {
  @ApiProperty({ example: 6 })
  //   @IsOptional()
  @Type(() => Number)
  @IsNumber()
  NFRMNO: number;

  @ApiProperty({ example: '050601' })
  //   @IsOptional()
  @IsString()
  VORGNO: string;

  @ApiProperty({ example: '25' })
  //   @IsOptional()
  @IsString()
  CYEAR: string;

  @ApiProperty({ example: '2025' })
  //   @IsOptional()
  @IsString()
  CYEAR2: string;

  @ApiProperty({ example: 10 })
  //   @IsOptional()
  @Type(() => Number)
  @IsNumber()
  NRUNNO: number;

  @ApiProperty({ example: '08375' })
  @IsOptional()
  @IsString()
  VAPVNO?: string;

  @ApiProperty({ example: '06' })
  @IsOptional()
  @IsString()
  CSTEPNO?: string;

  @ApiProperty({ example: '06' })
  @IsOptional()
  @IsString()
  CSTEPNEXTNO?: string;

  @ApiProperty({ example: '1' })
  @IsOptional()
  @IsString()
  CSTART?: string;

  @ApiProperty({ example: '3' })
  @IsOptional()
  @IsString()
  CSTEPST?: string;

  @ApiProperty({ example: '0' })
  @IsOptional()
  CAPVSTNO?: string | string[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  distinct?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
}
