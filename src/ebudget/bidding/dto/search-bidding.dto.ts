import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchEbudgetBiddingDto {
    @IsOptional()
    @IsString()
    VREQNO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    CYEAR2?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    FORMNO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    SSECCODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    SDEPCODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    SDIVCODE?: string;
}
