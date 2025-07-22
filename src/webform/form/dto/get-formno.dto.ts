import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class getFormnoDto {
  @ApiProperty({ required: false, example: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly NNO?: number;

  @ApiProperty({ required: false, example: '050601' })
  @IsOptional()
  @IsString()
  readonly VORGNO?: string;

  @ApiProperty({ required: false, example: '25' })
  @IsOptional()
  @IsString()
  readonly CYEAR?: string;

  @ApiProperty({ required: false, example: '2025' })
  @IsOptional()
  @IsString()
  readonly CYEAR2?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly NRUNNO?: number;
}
