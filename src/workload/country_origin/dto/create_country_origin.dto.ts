import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCountryOriginDto {
    @IsNotEmpty()
    @IsString()
    BULKCODE: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ORIGIN_TYPE: number;

    @IsNotEmpty()
    @IsString()
    COUNTRY: string;

    @IsOptional()
    @IsString()
    MFG_NAME?: string;

    @IsOptional()
    @IsString()
    MFG_ADDRESS?: string;
}