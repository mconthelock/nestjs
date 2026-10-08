import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetDrawingBmDto {
    @ApiProperty({
        example: 'RD08',
        description: 'Process number pattern',
    })
    @IsString()
    @IsNotEmpty()
    process: string;

    @ApiProperty({
        example: 'YA239B388',
        description: 'Drawing number',
    })
    @IsString()
    @IsNotEmpty()
    drawing: string;

    @ApiProperty({
        example: '202606',
        description: 'BM date pattern',
    })
    @IsString()
    @IsNotEmpty()
    prod: string;
}