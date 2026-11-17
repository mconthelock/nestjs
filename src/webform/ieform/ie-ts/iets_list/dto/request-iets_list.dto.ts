import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RequestIetsListeDto {
    @IsNotEmpty()
    @IsString()
    DWGNO: string;

    @IsOptional()
    @IsString()
    PRTNAME: string;

    @IsOptional()
    @IsString()
    ITMNO: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    QTY: number;

    @IsNotEmpty()
    @IsString()
    PROCESS: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    CUR_TP: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    CUR_TC: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    AF_TP: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    AF_TC: number;
}
