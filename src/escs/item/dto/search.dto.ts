import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
export class SearchDto {
    @IsOptional()
    @IsString()
    readonly IT_NO?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly IT_USERUPDATE?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly IT_STATUS?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly SEC_ID?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly IT_QCDATE?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly IT_MFGDATE?: number;

}