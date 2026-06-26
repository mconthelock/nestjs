import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class InCheckDto {
    @ApiProperty({ example: '2026045', description: 'Production' })
    @IsString()
    @Type(() => String)
    prod: string;

    @ApiProperty({ example: 'E8BE11016', description: 'Order number' })
    @IsString()
    order: string;

    @ApiProperty({ example: '101-05', description: 'Item number' })
    @IsString()
    item: string;

    @ApiProperty({ example: 1, description: 'Drawing ID' })
    @IsNumber()
    @Type(() => Number)
    dwgId: number;

    @IsOptional()
    @ApiProperty({
        example: '202604221115',
        description: 'Create checksheet date',
    })
    @IsString()
    @Type(() => String)
    reg?: string;

    @ApiProperty({ example: 1, description: 'User ID' })
    @IsNumber()
    @Type(() => Number)
    user: number;
}
