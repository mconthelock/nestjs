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
    readonly VORGNO?: string;

    @IsOptional()
    @IsString()
    readonly CYEAR?: string;

    @IsOptional()
    @IsString()
    readonly CYEAR2?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly NRUNNO?: number;

    @IsOptional()
    @IsString()
    readonly VREQNO?: string;

    @IsOptional()
    @IsString()
    readonly VINPUTER?: string;

    @IsOptional()
    @IsString()
    readonly VREMARK?: string;

    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    readonly DREQDATE?: Date;

    @IsOptional()
    @IsString()
    readonly CREQTIME?: string;

    @IsOptional()
    @IsString()
    readonly CST?: string;

    @IsOptional()
    @IsString()
    readonly VFORMPAGE?: string;

    @IsOptional()
    @IsString()
    readonly VREMOTE?: string;

    @IsOptional()
    @IsString()
    readonly EMPNO?: string;
}
