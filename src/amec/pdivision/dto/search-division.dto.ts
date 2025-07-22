import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SearchDivisionDto {
    @ApiProperty({ required: false, example: '050101' })
    @IsOptional()
    @IsString()
    readonly SDIVCODE?: string;

    @ApiProperty({ required: false, example: ["SDIV", "SDIVISION", "SDIV"] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    fields?: string[];
}