import { Type } from 'class-transformer';
import {
    IsOptional,
    IsString,
    IsNumber,
    IsArray,
    IsDateString,
    IsNotEmpty,
} from 'class-validator';
export class CreateAttcnfrmDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    NFRMNO: number;

    @IsNotEmpty()
    @IsString()
    VORGNO: string;

    @IsNotEmpty()
    @IsString()
    CYEAR: string;

    @IsNotEmpty()
    @IsString()
    CYEAR2: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    NRUNNO: number;

    // @IsNotEmpty()
    // @Type(() => Number)
    // @IsNumber()
    // ITEMNO: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    TYPENO: number;

    @IsNotEmpty()
    @IsString()
    SFILE: string;

    @IsNotEmpty()
    @IsString()
    SEMPNO: string;
}
