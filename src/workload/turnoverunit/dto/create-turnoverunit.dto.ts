import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
export class CreateTurnoverunitDto {
    @IsNumber()
    @Type(() => Number)
    ID: number;

    @IsNumber()
    @Type(() => Number)
    PERIOD: number;

    @IsString()
    MONTHYEAR: string;

    @IsNumber()
    @Type(() => Number)
    PLAN_VALUE: number;

    @IsNumber()
    @Type(() => Number)
    ACTUAL_VALUE: number;

    @IsDate()
    @Type(() => Date)
    CREATED_AT: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    UPDATED_AT: Date;
}
