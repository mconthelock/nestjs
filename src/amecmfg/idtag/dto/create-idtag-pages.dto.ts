import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIdtagPagesDto {
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
    PAGE_TAG: string;

    @IsOptional()
    @IsString()
    PAGE_IMG?: string;

    @IsOptional()
    @IsString()
    PAGE_CN?: string;

    @IsOptional()
    @IsString()
    PAGE_FRIST?: string;

    @IsOptional()
    @IsString()
    PAGE_NC?: string;

    @IsOptional()
    @IsString()
    PAGE_STATUS?: string;
}
