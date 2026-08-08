import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateProblemMasterDto {
    @IsString()
    PB_CODE: string;

    @IsString()
    PB_COLOR: string;

    @IsString()
    PB_DIFINATION: string;

    @IsString()
    PB_MEANING: string;

    @IsNumber()
    @Type(() => Number)
    PRIORITY: number;

    @IsString()
    PB_COLOR_CHART: string;

    @IsNumber()
    @Type(() => Number)
    PB_STATUS: number;
}
