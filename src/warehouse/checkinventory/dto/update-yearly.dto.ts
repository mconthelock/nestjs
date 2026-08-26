import {
    IsArray,
    IsNotEmpty,
    IsString,
    IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';

export class InventoryDetailDto {
    @IsString()
    @IsNotEmpty()
    TAG_NO: string;

    @IsString()
    @IsNotEmpty()
    ITEM_CODE: string;

    @IsNumber()
    ACTUAL: number;

    @IsString()
    EMPNO: string;
}

export class UpdateYearlyDto {
    @IsNumber()
    reportID: number;

    @IsArray()
    @Type(() => InventoryDetailDto)
    detail: InventoryDetailDto[];
}
