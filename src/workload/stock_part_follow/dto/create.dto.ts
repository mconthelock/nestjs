import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStockPartFollowDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    ITEM: string;

    @IsNotEmpty()
    @IsString()
    DRAWING: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PROD: string;

    @IsNotEmpty()
    @IsString()
    IDTAG: string;

    @IsNotEmpty()
    @IsString()
    PROCESS: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    PLAN?: number;

    @IsOptional()
    @IsString()
    REMARK?: string;
}
