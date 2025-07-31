import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SearchRepDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly NFRMNO?: number;

  @IsOptional()
  @IsString()
  readonly VORGNO?: string;

  @IsOptional()
  @IsString()
  readonly CYEAR?: string;
  
  @IsOptional()
  @IsString()
  readonly VEMPNO?: string;
}
