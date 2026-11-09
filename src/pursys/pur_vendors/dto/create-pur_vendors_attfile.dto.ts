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
export class CreatePurVendorsAttfileDto {
   
   @IsNotEmpty()
   @IsString()
   FILE_NAME: string;
   
   @IsNotEmpty()
   @IsString()
   UFILE_NAME: string;

}
