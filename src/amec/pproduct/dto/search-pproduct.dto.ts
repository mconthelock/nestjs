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
export class SearchPproductDto {
    @IsOptional()
    @IsString()
    SPRODCODE?: string;

    @IsOptional()
    @IsString()
    SEXPTYPE?: string; 

    @IsOptional()
    @IsString()
    SEPRODNAME?: string;  
}
