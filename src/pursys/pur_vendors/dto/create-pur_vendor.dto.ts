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
export class CreatePurVendorDto {
    @ApiProperty({ description: 'ชื่อของ Vendor', example: 'บริษัท ABC จำกัด' })
    @IsNotEmpty()
    @IsString()
    VND_NAME: string;

    @ApiProperty({ description: 'ชื่อเต็มของ Vendor', example: 'บริษัท ABC จำกัด' })
    @IsNotEmpty()
    @IsString()
    VND_LONGNAME: string;


    @IsNotEmpty()
    @IsNumber()
    VND_TYPE: number;

    @ApiPropertyOptional({description: 'Vendor registration date', example: '2024-01-01' })
    @IsOptional()
    @IsDateString()
    VND_REGDATE?: string;

    @ApiPropertyOptional({description: 'Vendor last update date', example: '2024-01-01' })
    @IsOptional()
    @IsDateString()
    VND_LASTUPDATE?: string;

  
    @IsOptional()
    @IsNumber()
    VND_STATUS: number;

    @IsOptional()
    @IsNumber()
    VND_USERUPDATE: number; 

    @IsOptional()
    @IsNumber()
    ADDR_BRANCH_CODE: number;

    @IsOptional()
    @IsString()
    ADDR_BRANCH_DESC: string;

    @IsNotEmpty()
    @IsString()
    ADDR_LINE1: string;

    @IsOptional()
    @IsString()
    ADDR_LINE2: string;

    @IsOptional()
    @IsString()
    ADDR_LINE3: string;

    @IsOptional()
    @IsString()
    ADDR_CITY: string;

    @IsOptional()
    @IsString()
    ADDR_STATE: string;

    @IsOptional()
    @IsNumber()
    ADDR_COUNTRY: number; 

    @IsOptional()
    @IsString()
    ADDR_ZIPCODE: string; 

    @IsOptional()
    @IsString()
    ADDR_PHONE: string; 

    @IsOptional()
    @IsString()
    ADDR_WEB: string; 

}
