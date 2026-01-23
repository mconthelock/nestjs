import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SearchEbudgetSnDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    FYEAR: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VORGCODE?: string;
}
