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

    @IsString()
    @IsOptional()
    @Type(() => String)
    CYEAR2?: string;

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
