import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
export class SearchDto {
    @IsOptional()
    @IsString()
    readonly SDIVCODE?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    fields?: string[];
}