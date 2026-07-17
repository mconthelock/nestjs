import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsDate,
} from 'class-validator';
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    SPRODCODE: string;

    @IsString()
    @IsOptional()
    SPRODID?: string;

    @IsString()
    @IsNotEmpty()
    SEPRODNAME: string;

    @IsString()
    @IsOptional()
    SEDESC?: string;

    @IsString()
    @IsNotEmpty()
    SEUNITCODE: string;

    @IsString()
    @IsOptional()
    STPRODNAME?: string;

    @IsString()
    @IsOptional()
    STDESC?: string;

    @IsString()
    @IsOptional()
    STUNITCODE?: string;

    @IsString()
    @IsOptional()
    ACCCODE?: string;

    @IsString()
    @IsOptional()
    HAZARDNO?: string;

    @IsString()
    @IsOptional()
    HAZARDSTATUS?: string;

    @IsString()
    IS_ACTIVE: string;

    @IsDate()
    @Type(() => Date)
    CREATED_AT: Date;

    @IsString()
    CREATED_BY: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    UPDATE_AT?: Date;

    @IsString()
    @IsOptional()
    UPDATE_BY?: string;

    @IsNumber()
    @Type(() => Number)
    CATEGORY_ID: number;

    @IsOptional()
    EXTRA_ATTRIBUTES?: Record<string, any>;
}
