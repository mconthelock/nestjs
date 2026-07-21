import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RequestPurevaScoreDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    EVAID: number;
    
    @IsOptional()
    @IsString()
    TOPIC?: string;

    @IsOptional()
    @IsString()
    TOPIC_DESC?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    SCORE?: number;

    @IsOptional()
    @IsString()
    SLEVEL?: string;

}