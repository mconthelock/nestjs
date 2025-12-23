import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class SearchSectionDto {
    @ApiPropertyOptional({ example: '050604' })
    @IsOptional()
    @IsString()
    readonly SSECCODE?: string;

    @ApiPropertyOptional({ example: '050601' })
    @IsOptional()
    @IsString()
    readonly SDEPCODE?: string;

    @ApiPropertyOptional({ example: '050101' })
    @IsOptional()
    @IsString()
    readonly SDIVCODE?: string;

    @ApiPropertyOptional({ type: [String], example: ["SDIVCODE", "SDIVISION", "SDIV", "SDEPCODE", "SDEPARTMENT", "SDEPT", "SSECCODE", "SSECTION", "SSEC"] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    fields?: string[];
}