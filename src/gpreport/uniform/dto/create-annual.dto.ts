import { Type } from 'class-transformer';
import {
    IsString,
    IsOptional,
    IsDate,
    IsNumber,
    IsNotEmpty,
} from 'class-validator';

export class CreateAnnualDetailDto {
    @IsNumber()
    @Type(() => Number)
    PRODUCT: number;

    @IsNumber()
    @Type(() => Number)
    REQUEST_QTY: number;

    @IsString()
    @IsOptional()
    REMARK?: string;

    @IsString()
    @IsOptional()
    ADJUST?: string;

    @IsString()
    @IsOptional()
    EXTRA?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    DISCOUNT?: number;
}

export class CreateAnnualDto {
    @IsNumber()
    @Type(() => Number)
    REQ_YEAR: number;

    @IsString()
    REQ_USER: string;

    @IsDate()
    @Type(() => Date)
    CREATE_DATE: Date;

    @IsString()
    CREATE_BY: string;

    @IsString()
    CSTATUS: string;

    @IsString()
    @IsOptional()
    REMARK?: string;

    @IsNotEmpty()
    @Type(() => CreateAnnualDetailDto)
    DETAILS: CreateAnnualDetailDto[];
}
