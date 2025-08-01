import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SearchOrderDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'EOSO19035' })
    ORD_NO?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '188-01S' })
    ORD_ITEM?: string;
    
    @IsOptional()
    @IsString()
    @ApiProperty({ example: '2025061' })
    ORD_PRODUCTION?: string;
}
