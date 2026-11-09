import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVendorAddressDto {
    @IsString()
    ADDR_ID: string;

    @IsString()
    ADDR_TYPE: string;

    @IsString()
    ADDR_LINE1: string;

    @IsString()
    ADDR_LINE2: string;

    @IsString()
    ADDR_LINE3: string;

    @IsString()
    ADDR_SUB_CITY: string;

    @IsString()
    ADDR_CITY: string;

    @IsString()
    ADDR_STATE: string;

    @IsString()
    ADDR_COUNTRY: string;

    @IsString()
    ADDR_ZIPCODE: string;

    @IsString()
    VENDOR_ID: string;
}
