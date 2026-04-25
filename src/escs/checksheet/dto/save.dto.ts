import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SaveDto {
    @ApiProperty({ example: 'draft', description: 'Action (draft, submit, edit)' })
    @IsString()
    action: 'draft' | 'submit' | 'edit';

    @ApiProperty({ example: '2026045' })
    @IsString()
    prod: string;

    @ApiProperty({ example: 'E8BE11016' })
    @IsString()
    order: string;

    @ApiProperty({ example: '101-05' })
    @IsString()
    item: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    dwgid: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    user: number;
}