import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvestDto {
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
    @IsNumber()
    @Type(() => Number)
    CYEAR2?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NRUNNO?: number;

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
