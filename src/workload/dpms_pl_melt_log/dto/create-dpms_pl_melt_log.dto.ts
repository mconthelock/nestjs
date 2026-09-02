import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDpmsPlMeltLogDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    LOADNO: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    VANNDATE: Date;

    @IsNotEmpty()
    @IsString()
    AMECLOAD: string;

    @IsNotEmpty()
    @IsString()
    CONTAINSIZE: string;

    @IsNotEmpty()
    @IsString()
    PROJECT: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ACTUAL_WEIGHT: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    SENTDATE: Date;

    @IsNotEmpty()
    @IsString()
    LOGBY: string;
}
