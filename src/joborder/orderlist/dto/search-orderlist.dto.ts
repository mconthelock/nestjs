import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsBoolean, IsIn } from 'class-validator';
export class SearchOrderListDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    // TURNOVER_STATUS?: number;
    readonly TURNOVER_STATUS?: number;

    @IsOptional()
    @IsString()
    readonly AGENT?: string;

    @IsOptional()
    @IsString()
    readonly SERIES?: string;

    @IsOptional()
    @IsString()
    readonly SDESSCH?: string;

    @IsOptional()
    @IsString()
    readonly EDESSCH?: string;

    @IsOptional()
    @IsString()
    readonly SPRODSCH?: string;

    @IsOptional()
    @IsString()
    readonly EPRODSCH?: string;
    
    @IsOptional()
    @IsString()
    readonly SDESBMDATE?: string;

    @IsOptional()
    @IsString()
    readonly EDESBMDATE?: string;

    @IsOptional()
    @IsString()
    readonly SMFGBMDATE?: string;

    @IsOptional()
    @IsString()
    readonly EMFGBMDATE?: string;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)  
    readonly distinct?: boolean;


    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    fields?: string[];

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
    @IsString()
    readonly PARTNAME?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly DUEDATE?: number;

    @IsOptional()
    @IsString()
    readonly orderby?: string;

    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    readonly orderbyDirection?: 'ASC' | 'DESC';

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly JOP_PUR_STATUS?: number;

    @IsOptional()
    @IsString()
    readonly JOP_PUR_INPUT_DATE?: string;

    @IsOptional()
    @IsString()
    readonly JOP_PUR_CONFIRM?: string;
    
    @IsOptional()
    @IsString()
    readonly JOP_MAR_REQUEST?: string;
}