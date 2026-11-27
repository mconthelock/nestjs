import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreatePurPoDraftDto {
    @IsOptional()
    @IsString()
    eventId?: string;

    @Type(() => Number)
    @IsInt()
    ordId: number;

    @IsString()
    @IsNotEmpty()
    ordPoNo: string;

    @Type(() => Number)
    @IsInt()
    ordDocRev: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    ordRevision?: number;

    @Type(() => Number)
    @IsInt()
    ordType: number;

    @IsString()
    @IsNotEmpty()
    vendorCode: string;

    @IsOptional()
    @IsString()
    vendorName?: string;

    @Type(() => Number)
    @IsNumber()
    ordAmount: number;

    @IsOptional()
    @IsString()
    ordCurrency?: string;

    @IsString()
    @IsNotEmpty()
    buyerEmpNo: string;

    @IsOptional()
    @IsBoolean()
    isRevise?: boolean;

    @IsOptional()
    @IsString()
    remark?: string;
}
