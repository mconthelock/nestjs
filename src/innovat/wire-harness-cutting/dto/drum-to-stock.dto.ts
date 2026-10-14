import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DrumToStockDto {
    @ApiProperty({
        example: '15234',
        description: 'Employee number',
    })
    @IsString()
    @IsNotEmpty()
    empNo: string;

    @ApiProperty({
        example: 'F9999',
        description: 'Item code',
    })
    @IsString()
    @IsNotEmpty()
    itemCode: string;

    @ApiProperty({
        example: '2026091',
        description: 'Production number',
    })
    @IsString()
    @IsNotEmpty()
    prodNo: string;

    @ApiProperty({
        example: 1,
        description: 'Drum ID',
    })
    @IsNumber()
    drumId: number;
}