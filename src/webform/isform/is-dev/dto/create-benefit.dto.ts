import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBenefitDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NFRMNO?: number;

    @IsString()
    @IsOptional()
    VORGNO?: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    CYEAR?: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    CYEAR2?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NRUNNO?: number;

    @IsNumber()
    @Type(() => Number)
    BENEFIT: number;

    @IsNumber()
    @Type(() => Number)
    BENEFIT_CURRENT: number;

    @IsNumber()
    @Type(() => Number)
    BENEFIT_AFTER: number;
}
