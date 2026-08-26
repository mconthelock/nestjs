import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVendorDto {
    @IsString()
    @IsOptional()
    VND_CODE?: string;

    @IsString()
    VND_NAME: string;

    @IsDate()
    @Type(() => Date)
    VND_REGISTED: Date;

    @IsString()
    VND_STATUS: string;

    @IsString()
    @IsOptional()
    VND_TERM: string;

    @IsString()
    @IsOptional()
    VND_TYPE1?: string;

    @IsString()
    @IsOptional()
    VND_TYPE2?: string;

    @IsString()
    @IsOptional()
    VND_CURRENCY?: string;

    @IsString()
    @IsOptional()
    VND_PAYMENT?: string;

    @IsString()
    VND_ADDRESS1?: string;

    @IsString()
    @IsOptional()
    VND_ADDRESS2?: string;

    @IsString()
    @IsOptional()
    VND_CITY?: string;

    @IsString()
    @IsOptional()
    VND_STATE?: string;

    @IsString()
    @IsOptional()
    VND_COUNTRY?: string;

    @IsString()
    @IsOptional()
    VND_PHONE?: string;

    @IsString()
    @IsOptional()
    VND_FAX?: string;

    @IsString()
    @IsOptional()
    VND_CONTACTNAME?: string;

    @IsString()
    @IsOptional()
    VND_CATEGORY?: string;

    @IsString()
    @IsOptional()
    VND_BANO?: string;

    @IsString()
    @IsOptional()
    VND_CANO?: string;

    @IsString()
    @IsOptional()
    VND_TAXNO?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    CREATE_AT?: Date;

    @IsString()
    CREATE_BY: string;

    @IsNumber()
    @Type(() => Number)
    VENDGROUP: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    VENDPURPOSE?: number;
}
