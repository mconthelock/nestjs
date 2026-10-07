import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiligentDto {
    @IsString()
    EMPCOD: string;

    @IsString()
    SNAME: string;

    @IsString()
    STNAME: string;

    @IsString()
    SDIVCODE: string;

    @IsString()
    SDEPCODE: string;

    @IsString()
    SSECCODE: string;

    @IsString()
    SDIV: string;

    @IsString()
    SDEPT: string;

    @IsString()
    SSEC: string;

    @IsString()
    SPOSCODE: string;

    @IsString()
    SPOSNAME: string;

    @IsNumber()
    @Type(() => Number)
    DEHYAR: number;

    @IsNumber()
    @Type(() => Number)
    SUMDILIGENT: number;

    @IsNumber()
    @Type(() => Number)
    DEHT00: number;

    @IsNumber()
    @Type(() => Number)
    DEHT01: number;

    @IsNumber()
    @Type(() => Number)
    DEHT02: number;

    @IsNumber()
    @Type(() => Number)
    DEHT03: number;

    @IsNumber()
    @Type(() => Number)
    DEHT04: number;

    @IsNumber()
    @Type(() => Number)
    DEHT05: number;

    @IsNumber()
    @Type(() => Number)
    DEHT06: number;

    @IsNumber()
    @Type(() => Number)
    DEHT07: number;

    @IsNumber()
    @Type(() => Number)
    DEHT08: number;

    @IsNumber()
    @Type(() => Number)
    DEHT09: number;

    @IsNumber()
    @Type(() => Number)
    DEHT10: number;

    @IsNumber()
    @Type(() => Number)
    DEHT11: number;

    @IsNumber()
    @Type(() => Number)
    DEHT12: number;

    @IsNumber()
    @Type(() => Number)
    DEHLST: number;

    @IsNumber()
    @Type(() => Number)
    LVCOUNT: number;
}
