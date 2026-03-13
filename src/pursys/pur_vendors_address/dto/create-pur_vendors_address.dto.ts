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
export class CreatePurVendorsAddressDto {
   @ApiProperty({ description: 'ที่อยู่ภาษาไทย/อังกฤษ', example: 'อังกฤษ' })
   @IsNotEmpty()
   @IsString()
   ADDR_TYPE: string;

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
}
