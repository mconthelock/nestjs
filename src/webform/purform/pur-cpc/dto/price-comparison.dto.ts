import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PriceComparisonDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    FUNC: number;

    @IsNotEmpty()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @IsArray()
    ITEM: string[];
}
