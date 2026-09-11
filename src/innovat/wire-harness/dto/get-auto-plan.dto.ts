import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetAutoPlanDto {
    @ApiProperty({
        example: '2026071',
        description: 'Production number',
    })
    @IsString()
    @IsNotEmpty()
    prod: string;

    @ApiProperty({
        example: '',
        description: 'P value',
    })
    @IsString()
    p: string;

    @ApiProperty({
        example: '29506',
        description: 'Item number',
    })
    @IsString()
    @IsNotEmpty()
    item: string;
}