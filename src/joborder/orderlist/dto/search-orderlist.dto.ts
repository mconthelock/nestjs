import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';
export class SearchOrderListDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    readonly ORDTYPE?: string;

    @IsOptional()
    @IsString()
    readonly PRJ_NO?: string;

    @IsOptional()
    @IsString()
    readonly MFGNO?: string;

    @IsOptional()
    @IsString()
    readonly BUYEREMPNO?: string;

    @IsOptional()
    @IsString()
    readonly BUYERNAME?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly PRNO?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly PRDATE?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly PONO?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly PODATE?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly LINENO?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly VENDCODE?: number;

    @IsOptional()
    @IsString()
    readonly ITEM?: string;

    @IsOptional()
    @IsString()
    readonly DRAWING?: string;

    @IsOptional()
    @IsString()
    readonly INVOICE?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly DUEDATE?: number;

}