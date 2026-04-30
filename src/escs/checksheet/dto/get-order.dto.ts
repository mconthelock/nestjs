import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetOrderDto {
    @ApiProperty({ example: '2026045', description: 'Production number' })
    @IsString()
    @IsNotEmpty()
    prod: string;

    @ApiProperty({ example: 'E8BE11016', description: 'Order number' })
    @IsString()
    @IsNotEmpty()
    order: string;

    @ApiProperty({ example: '101-05', description: 'Item number' })
    @IsString()
    @IsNotEmpty()
    item: string;

    @ApiProperty({ example: 1, description: 'Drawing ID' })
    @Type(() => Number)
    @IsNumber()
    dwgId: number;
}