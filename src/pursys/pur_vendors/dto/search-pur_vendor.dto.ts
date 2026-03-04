import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class SearchPurVendorDto {
    @IsOptional()
    @IsString()
    KEYWORD?: string;

    @IsOptional()
    @IsNumber()
    STATUS?: number; 

    @IsOptional()
    @IsNumber()
    TYPE?: number;  
}
