import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SearchSectionDto {
    @ApiProperty({ required: false, example: '050604' })
    @IsOptional()
    @IsString()
    readonly SSECCODE?: string;

    @ApiProperty({ required: false, example: '050601' })
    @IsOptional()
    @IsString()
    readonly SDEPCODE?: string;

    @ApiProperty({ required: false, example: '050101' })
    @IsOptional()
    @IsString()
    readonly SDIVCODE?: string;

    @ApiProperty({ required: false, example: ["SDIVCODE", "SDIVISION", "SDIV", "SDEPCODE", "SDEPARTMENT", "SDEPT", "SSECCODE", "SSECTION", "SSEC"] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    fields?: string[];
}