import { Transform, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDate } from 'class-validator';

export class createPriceListDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    FYYEAR: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    PERIOD: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    ITEM: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    STATUS?: number;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    STARTIN?: Date;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    ENDIN?: Date | null;

    @Transform(({ value }) => (value !== undefined && value !== null ? String(value) : value))
    @IsString()
    @IsOptional()
    INQUIRY?: string;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    FCCOST: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    FCBASE: number;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    TCCOST: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    LATEST?: number;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    CREATE_AT?: Date;

    @IsString()
    @IsOptional()
    CREATE_BY?: string;
}
