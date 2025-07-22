import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class getExtDataDto {
  @ApiProperty({ example: 6 })
  //   @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly NNO: number;

  @ApiProperty({ example: '050601' })
  //   @IsOptional()
  @IsString()
  readonly VORGNO: string;

  @ApiProperty({ example: '25' })
  //   @IsOptional()
  @IsString()
  readonly CYEAR: string;

  @ApiProperty({ example: '2025' })
  //   @IsOptional()
  @IsString()
  readonly CYEAR2: string;

  @ApiProperty({ example: 1 })
  //   @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly NRUNNO: number;

  @IsString()
  readonly APV: string;
}
