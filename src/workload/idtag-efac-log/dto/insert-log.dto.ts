import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InsertLogDto {
    @ApiProperty({
        example: '8CB3705',
        description: 'Control No',
    })
    @IsString()
    @IsNotEmpty()
    ctrlno: string;

    @ApiProperty({
        example: 'B4CC06',
        description: 'Process',
    })
    @IsString()
    @IsNotEmpty()
    process: string;

    @ApiProperty({
        example: 10,
        description: 'Month',
    })
    @Type(() => Number)
    @IsNumber()
    month: number;

    @ApiProperty({
        example: 2026,
        description: 'Year',
    })
    @Type(() => Number)
    @IsNumber()
    year: number;

    @ApiProperty({
        example: 1,
        description: 'Run No',
    })
    @Type(() => Number)
    @IsNumber()
    runno: number;

    @ApiProperty({
        example: 'CC06-10-26-001',
        description: 'Lot No',
    })
    @IsString()
    @IsNotEmpty()
    lot: string;

    @ApiProperty({
        example: '49001',
        description: 'Employee No',
    })
    @IsString()
    @IsNotEmpty()
    empno: string;
}