import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class SearchDivisionDto {
    @ApiPropertyOptional({ example: '050101' })
    @IsOptional()
    @IsString()
    readonly SDIVCODE?: string;

    @ApiPropertyOptional({ type: [String], example: ["SDIV", "SDIVISION", "SDIV"] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    fields?: string[];
}