import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDpmsPlCaseListDetailDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NCASELIST_ID: number;

    @IsNotEmpty()
    @IsString()
    VMFGNO: string;

    @IsNotEmpty()
    @IsString()
    VCASE: string;

    @IsNotEmpty()
    @IsString()
    VITEM: string;

    @IsNotEmpty()
    @IsString()
    VPART: string;

    @IsNotEmpty()
    @IsString()
    VDRAWING: string;

    @IsOptional()
    @IsString()
    VDRAWINGL?: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NQTY: number;

    @IsOptional()
    @IsString()
    VORDER_PACK?: string;

    @IsOptional()
    @IsString()
    VDRAWING_PACKING?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPOSEQ?: number;
}
