import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsDateString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurVendorsCodeDto } from 'src/pursys/pur_vendors_code/dto/create-pur_vendors_code.dto';
import { CreatePurVendorsAddressDto } from 'src/pursys/pur_vendors_address/dto/create-pur_vendors_address.dto';
import { CreatePurVendorsAttfileDto } from 'src/pursys/pur_vendors_attfile/dto/create-pur_vendors_attfile.dto'; 
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreatePurVendorDto {
    @ApiProperty({ description: 'ชื่อของ Vendor', example: 'ABC Company' })
    @IsNotEmpty()
    @IsString()
    VND_NAME: string;

    @ApiProperty({ description: 'ชื่อภาษาไทย', example: 'บริษัท ABC จำกัด' })
    @IsOptional()
    @IsString()
    VND_TNAME: string;

    @ApiProperty({ description: 'ชื่อผู้ติดต่อ', example: 'John Doe' })
    @IsOptional()
    @IsString()
    VND_SALE: string;

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
    @IsString()
    ADDR_PHONE: string; 

    @IsOptional()
    @IsString()
    ADDR_WEB: string; 

    @IsOptional() 
    @IsArray() 
    @ValidateNested({ each: true }) 
    @Type(() => CreatePurVendorsCodeDto) 
    VENDOR_CODES?: CreatePurVendorsCodeDto[];

    @IsOptional() 
    @IsArray() 
    @ValidateNested({ each: true }) 
    @Type(() => CreatePurVendorsAddressDto) 
    VENDOR_ADDRESS?: CreatePurVendorsAddressDto[];

    @IsOptional() 
    @IsArray() 
    @ValidateNested({ each: true }) 
    @Type(() => CreatePurVendorsAttfileDto)
    VENDOR_ATTFILE?: CreatePurVendorsAttfileDto[];

}
