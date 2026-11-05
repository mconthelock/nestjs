import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePurPraReasonDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NREASON_ID: number;

    @IsOptional()
    @IsString()
    VVALUE?: string;

    @IsOptional()
    @IsString()
    VFROM?: string;

    @IsOptional()
    @IsString()
    VTO?: string;
}
