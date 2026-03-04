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
export class CreatePproductDto {
    @IsNotEmpty()
    @IsString()
    SPRODCODE: string;

    @IsNotEmpty()
    @IsString()
    SEXPTYPE: string;

    @ApiPropertyOptional({description: 'Vendor code', example: '60335' })
    @IsOptional()
    @IsString()
    SVENDCODE?: string;    

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SPRODID?: string;  

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    STPRODNAME?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SEPRODNAME?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SMODEL?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    STDESC?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SEDESC?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SIMAGE?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    DADDDATE?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SEMPNO?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SCATID?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SCURCODE?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SUNITCODE?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SACCOUNTCODE?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SACCODE?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SACCCODE?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SCATTYPE?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SEPRODNAMEN?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SDRAWNUM?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SSPEC?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SCOUNTRY?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SDIMEN?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SBRAND?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SMARKERN?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    SLEVEL?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)  
    @IsNumber()
    NPRICE?: number; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    HAZARDNO?: string; 

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    HAZARDSTATUS?: string; 
}
