import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class InsertCartonDto {
    @IsNotEmpty()
    @IsString()
    ORDER_NO: string;

    @IsNotEmpty()
    @IsString()
    PACKING_NO: string;

    @IsNotEmpty()
    @IsString()
    CARTONBOX: string;

    @IsNotEmpty()
    @IsNumber()
    QTY: number;

    @IsNotEmpty()
    @IsString()
    CREATED_BY: string;
}

export class InsertListCartonDto {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InsertCartonDto)
    items: InsertCartonDto[];
}
