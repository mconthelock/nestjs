import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class SearchOriginMasterMarViewDto {
    
    @IsOptional()
    @IsString()
    DRAWING?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number) 
    ITEMNO?: number;

    @IsOptional()
    @IsString()
    PARTNAME?: string;
}