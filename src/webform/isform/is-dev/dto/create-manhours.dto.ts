import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateManhoursDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    NFRMNO?: number;

    @IsString()
    @IsOptional()
    VORGNO?: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    CYEAR?: string;

    @IsOptional()
    @IsString()
    CYEAR2?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NRUNNO?: number;

    @IsString()
    POSITION: string;

    @IsNumber()
    @Type(() => Number)
    COST: number;

    @IsNumber()
    @Type(() => Number)
    HOURS_PRESENT: number;

    @IsNumber()
    @Type(() => Number)
    HOURS_AFTER: number;
}
