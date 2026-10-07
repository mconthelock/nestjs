import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RequestPurevaVendorRelationDto {

    @IsOptional()
    @IsString()
    ENTITY_TYPE?: string;

    @IsOptional()
    @IsString()
    ENTITY_NAME?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    PERCENT?: number;

}
