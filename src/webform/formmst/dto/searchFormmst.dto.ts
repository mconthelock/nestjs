import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchFormmstDto {
  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  NNO?: number;

  @ApiPropertyOptional({ example: '050601' })
  @IsOptional()
  @IsString()
  VORGNO?: string;

  @ApiPropertyOptional({ example: '25' })
  @IsOptional()
  @IsString()
  CYEAR?: string;

  @ApiPropertyOptional({ example: 'IS-TID' })
  @IsOptional()
  @IsString()
  VANAME?: string;

  @ApiPropertyOptional({ type: [String], example: ['NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
}
