import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RequestPurevaProfitTurnoverDto {
    
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ID: number;

    @IsOptional()
    @IsString()
    RECORD_TYPE?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    MYEAR?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    AMOUNT?: number;

}
