import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class UpdateIsSefDto {
    @Type(() => Number)
    @IsNumber()
    NFRMNO: number;

    @IsString()
    VORGNO: string;

    @IsString()
    CYEAR: string;

    @IsString()
    CYEAR2: string;

    @Type(() => Number)
    @IsNumber()
    NRUNNO: number;

    @IsOptional()
    @IsNumber()
    PRO_AVG?: number;

    @IsOptional()
    @IsNumber()
    APP_AVG?: number;

    @IsOptional()
    @IsNumber()
    OVERALL_AVG?: number;

    @IsOptional()
    @IsNumber()
    LEVEL?: number;

    @IsOptional()
    @IsString()
    COMMENT?: string;

    @IsOptional()
    @IsObject()
    SCORE?: Record<string, number>;
}
