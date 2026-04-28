import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class InCheckDto {
    @ApiProperty({ example: '2026045', description: 'Production' })
    @IsString()
    prod: string;

    @ApiProperty({ example: 'E8BE11016', description: 'Order number' })
    @IsString()
    order: string;

    @ApiProperty({ example: '101-05', description: 'Item number' })
    @IsString()
    item: string;

    @ApiProperty({ example: 1, description: 'Drawing ID' })
    @IsNumber()
    dwgid: number;

    @ApiProperty({ example: '202604221115', description: 'Create checksheet date' })
    @IsString()
    reg: string;

    @ApiProperty({ example: 1, description: 'User ID' })
    @IsNumber()
    user: number;
}