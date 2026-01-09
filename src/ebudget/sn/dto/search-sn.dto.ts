import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SearchEbudgetSnDto {
    @IsNotEmpty()
    @IsString()
    FYEAR: string;

    @IsOptional()
    @IsString()
    VORGCODE?: string;
}
