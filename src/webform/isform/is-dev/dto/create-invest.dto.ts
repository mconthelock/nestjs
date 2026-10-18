import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvestDto {
    @IsNumber()
    @Type(() => Number)
    NFRMNO: number;

    @IsString()
    VORGNO: string;

    @IsString()
    @Type(() => String)
    CYEAR: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    CYEAR2: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NRUNNO: number;

    @IsNumber()
    @Type(() => Number)
    DEVICE: number;

    @IsNumber()
    @Type(() => Number)
    PRICE: number;

    @IsNumber()
    @Type(() => Number)
    QTY: number;
}
