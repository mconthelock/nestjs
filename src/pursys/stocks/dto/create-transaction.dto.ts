import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
} from 'class-validator';

export class CreateTransactionItemsDto {
    @IsNumber()
    TRANSACTION_ID: number;

    @IsNumber()
    PRODUCT_ID: number;

    @IsNumber()
    @IsOptional()
    LOT_ID?: number;

    @IsNumber()
    QUANTITY: number;

    @IsNumber()
    UNIT_COST: number;

    @IsString()
    REMARK: string;
}

export class CreateTransactionDto {
    @IsString()
    DOCUMENT_NO: string;

    // @IsNumber()
    // @IsOptional()
    // @Type(() => Number)
    // TRNTYPE?: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    STORAGE_FROM?: number;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    STORAGE_TO?: number;

    @IsString()
    CSTATUS: string;

    @IsDate()
    @Type(() => Date)
    CREATED_AT: Date;

    @IsString()
    CREATED_BY: string;

    @IsNotEmpty()
    @Type(() => CreateTransactionItemsDto)
    ITEMS: CreateTransactionItemsDto[];
}
