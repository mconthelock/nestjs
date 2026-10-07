import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, isString, IsString } from 'class-validator';

export class CreateDpmsPlIssueRevDto {
    @IsNotEmpty()
    @IsString()
    VPROD: string;

    @IsNotEmpty()
    @IsString()
    VP: string;

    @IsNotEmpty()
    @IsString()
    VORDERS: string;

    @IsNotEmpty()
    @IsString()
    VTYPE: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NISSUE_TYPE: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NREV?: number;

    @IsOptional()
    @IsString()
    VREVTEXT?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NROUND?: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NPDFID: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NEXCELID: number;

    @IsNotEmpty()
    @IsString()
    VSHOPORDERNO: string;

    @IsNotEmpty()
    @IsString()
    VSUBJECT: string;

    @IsNotEmpty()
    @IsString()
    VNAMEOFBLDG: string;

    @IsNotEmpty()
    @IsString()
    VSOLDTO: string;

    @IsNotEmpty()
    @IsString()
    VSHIPPINGMARK: string;

    @IsNotEmpty()
    @IsString()
    VISSUEBY: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NDOCTYPE: number;
}
