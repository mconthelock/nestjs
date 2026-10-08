import { Type } from 'class-transformer';
import {
    IsString,
    IsOptional,
    IsDate,
    IsNumber,
    IsNotEmpty,
} from 'class-validator';

export class CreateCalendarDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    FYEAR: number;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    SDATE: Date;

    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    EDATE: Date;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    CREATE_AT?: Date;

    @IsString()
    @IsOptional()
    CREATE_BY?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    UPDATE_AT?: Date;

    @IsString()
    @IsOptional()
    UPDATE_BY?: string;
}
