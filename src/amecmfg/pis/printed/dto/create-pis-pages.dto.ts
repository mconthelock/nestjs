import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePisPagesDto {
    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    FILES_ID: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    PAGE_NUM: number;

    @IsNotEmpty()
    @IsString()
    PAGE_MFGNO: string;

    @IsOptional()
    @IsString()
    PAGE_PACKING?: string;

    @IsOptional()
    @IsString()
    PAGE_STATUS?: string;
}
