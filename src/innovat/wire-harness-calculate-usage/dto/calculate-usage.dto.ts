import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CalculateUsageDto {
    @ApiProperty({
        example: 1,
        description: 'Group ID',
    })
    @Type(() => Number)
    @IsNumber()
    groupId: number;

    @ApiProperty({
        example: '2026091',
        description: 'Production No From',
    })
    @IsString()
    @IsNotEmpty()
    prodNoFrom: string;

    @ApiProperty({
        example: '2026091',
        description: 'Production No To',
    })
    @IsString()
    @IsNotEmpty()
    prodNoTo: string;
}