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
export class CreatePurVendorsCodeDto {

    @IsNotEmpty()
    @IsNumber()
    CODE_NUM: number;

    @IsOptional()
    @IsNumber()
    VENDOR_ID: number;

    @IsOptional()
    @IsNumber()
    CODE_STATUS: number;

    @ApiPropertyOptional({description: 'Code registration date', example: '2024-01-01' })
    @IsOptional()
    @IsDateString()
    CODE_REGDATE?: string;

    @IsOptional()
    @IsString()
    CODE_CURRENCY: string;

    @IsOptional()
    @IsNumber()
    CODE_SHIP: number;

    @IsOptional()
    @IsString()
    CODE_PAY: string;

    @IsOptional()
    @IsNumber()
    CODE_TYPE: number;

}
