import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateDrumDto {
    @ApiProperty({
        example: '99999',
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
        example: '2026081',
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

    @ApiProperty({
        example: 'C6071300JC4',
        description: 'Control number',
    })
    @IsString()
    @IsNotEmpty()
    ctrlNo: string;

    @ApiProperty({
        example: 100.9,
        description: 'Cut length',
    })
    @IsNumber()
    cut: number;

    @ApiProperty({
        example: 1,
        description: 'Cut type (1 = First Cut, 2 = Re-Cut)',
    })
    @IsNumber()
    cutType: number;
}