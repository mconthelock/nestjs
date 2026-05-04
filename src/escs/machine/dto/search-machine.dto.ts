import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchMachineDto {
    @ApiProperty({ example: 'PULL' })
    @IsString()
    @IsNotEmpty()
    mcType: string;

    @ApiProperty({ example: 2 })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    mcNo: number;
}