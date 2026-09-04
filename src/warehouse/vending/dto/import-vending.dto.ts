import {
    IsArray,
    IsDate,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ImportHistoryDto {
    @IsString()
    FILE_NAME: string;

    @Type(() => Number)
    @IsNumber()
    TOTAL_ROW: number;

    @Type(() => Number)
    @IsNumber()
    TOTAL_QTY: number;

    @Type(() => Number)
    @IsNumber()
    TOTAL_AMOUNT: number;

    @IsString()
    STATUS: string;

    @IsOptional()
    @IsString()
    IMPORT_BY: string | null;
}

export class WithdrawalDto {
    @IsString()
    PRODUCT_ID: string;

    @IsString()
    STORAGE_LOCATION: string;

    @IsString()
    BRAND: string;

    @IsString()
    SUPPLIER: string;

    @Type(() => Number)
    @IsNumber()
    QUANTITY: number;

    @Type(() => Number)
    @IsNumber()
    UNIT_PRICE: number;

    @Type(() => Number)
    @IsNumber()
    TOTAL_AMOUNT: number;

    @IsString()
    PO_NO: string;

    @IsString()
    EMPLOYEE_CODE: string;

    @IsString()
    RECORD_DATE: string;

    @IsString()
    WITHDRAW_TIME: string;
}

export class RefillDto {
    @Type(() => Date)
    @IsDate()
    REFILL_DATETIME: Date;

    @IsString()
    PRODUCT_ID: string;

    @IsString()
    STORAGE_LOCATION: string;

    @Type(() => Number)
    @IsNumber()
    REFILL_QTY: number;

    @Type(() => Number)
    @IsNumber()
    QTY_BEFORE: number;

    @Type(() => Number)
    @IsNumber()
    QTY_AFTER: number;

    @IsString()
    CREATED_BY: string;
}

export class CreateImportDto {
    @ValidateNested()
    @Type(() => ImportHistoryDto)
    importHistory: ImportHistoryDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WithdrawalDto)
    withdrawals: WithdrawalDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RefillDto)
    refills: RefillDto[];
}
