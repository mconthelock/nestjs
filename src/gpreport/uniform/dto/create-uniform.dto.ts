import { IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUniformDto {
    @IsNumber()
    @Type(() => Number)
    PROD_ID: number;

    @IsString()
    PROD_CODE: string;

    @IsString()
    PROD_SIZES: string;

    @IsString()
    PROD_WIDTH: string;

    @IsString()
    PROD_HEIGHT: string;

    @IsNumber()
    @Type(() => Number)
    PROD_CATEGORY: number;

    @IsNumber()
    @Type(() => Number)
    PROD_MIN: number;

    @IsNumber()
    @Type(() => Number)
    PROD_REMAIN: number;

    @IsString()
    PROD_STATUS: string;

    @IsNumber()
    @Type(() => Number)
    PROD_PRICE: number;

    @IsDate()
    @Type(() => Date)
    UPDATE_DATE: Date;

    @IsString()
    UPDATE_BY: string;

    @IsNumber()
    @Type(() => Number)
    PROD_ALOC: number;

    @IsString()
    PROD_TYPE: string;
}
