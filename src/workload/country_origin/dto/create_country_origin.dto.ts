import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateCountryOriginDto {
    @IsNotEmpty()
    @IsString()
    BULKCODE: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ORIGIN_TYPE: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    COUNTRY_MODE: number;

    @IsNotEmpty()
    @IsString({ each: true })
    COUNTRY: string | string[];

    @IsOptional()
    @IsString()
    MFG_NAME?: string;

    @IsOptional()
    @IsString()
    MFG_ADDRESS?: string;

    @IsOptional()
    @IsString()
    CREATEBY?: string;

    @IsOptional()
    @IsString()
    UPDATEBY?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    UPDATEDATE?: Date;
}
