import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateVendorAddressDto } from './create-address.dto';
export class CreateVendorDto {
    @IsString()
    VND_ID: string;

    @IsString()
    VND_NAME: string;

    @IsString()
    VND_TNAME: string;

    @IsString()
    VND_SALE: string;

    @IsString()
    VND_TYPE: string;

    @IsString()
    VND_REGDATE: string;

    @IsString()
    VND_LASTUPDATE: string;

    @IsString()
    VND_STATUS: string;

    @IsString()
    VND_USERUPDATE: string;

    @IsString()
    ADDR_PHONE: string;

    @IsString()
    ADDR_WEB: string;

    @IsString()
    EMAIL: string;

    @IsString()
    FAX: string;

    @IsString()
    BANKNAME: string;

    @IsString()
    BRANCH: string;

    @IsString()
    ACCNUMBER: string;

    @IsOptional()
    @Type(() => CreateVendorAddressDto)
    ADDRESSES?: CreateVendorAddressDto[];
}
