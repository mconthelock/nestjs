import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchFormmstDto {
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

  @ApiProperty({ required: false, example: 'IS-TID' })
  @IsOptional()
  @IsString()
  readonly VANAME?: string;

  @ApiProperty({ required: false, example: ['NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
}
