import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  isNotEmpty,
} from 'class-validator';

export class SearchFormDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly NFRMNO?: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly VORGNO?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly CYEAR?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly CYEAR2?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly NRUNNO?: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly VREQNO?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly VINPUTER?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly VREMARK?: string;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  readonly DREQDATE?: Date;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly CREQTIME?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly CST?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly VFORMPAGE?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly VREMOTE?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly EMPNO?: string;
}
