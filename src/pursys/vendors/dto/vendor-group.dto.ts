import { IsArray, IsOptional, IsString } from 'class-validator';

export class SearchVendorGroupDto {
    @IsString()
    @IsOptional()
    keyword?: string;

    @IsString()
    @IsOptional()
    GROUP_ID?: string;
}

export class LinkVendorCodesDto {
    @IsString()
    @IsOptional()
    GROUP_ID?: string;

    @IsString()
    @IsOptional()
    GROUP_NAME?: string;

    @IsArray()
    @IsString({ each: true })
    VND_CODES: string[];

    @IsString()
    @IsOptional()
    PRIMARY_CODE?: string;

    @IsString()
    @IsOptional()
    REMARK?: string;

    @IsString()
    @IsOptional()
    USER_BY?: string;
}

export class SetPrimaryVendorCodeDto {
    @IsString()
    GROUP_ID: string;

    @IsString()
    VND_CODE: string;

    @IsString()
    @IsOptional()
    USER_BY?: string;
}

export class UnlinkVendorCodeDto {
    @IsString()
    GROUP_ID: string;

    @IsString()
    VND_CODE: string;
}
