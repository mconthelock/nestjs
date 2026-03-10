import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateMfgDrawingActionDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NDRAWINGID: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NACTION: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NSTATUS?: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NUSERACT: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    DACTDATE: Date;
}
