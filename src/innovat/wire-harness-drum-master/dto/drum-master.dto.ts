import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DrumMasterDto {
    @ApiProperty({
        example: 'F73175',
        description: 'Item code',
    })
    @IsString()
    @IsNotEmpty()
    itemCode: string;

    @ApiProperty({
        example: 1,
        description: 'Group ID',
    })
    @Type(() => Number)
    @IsNumber()
    groupId: number;

    @ApiProperty({
        example: 'EVV25C',
        description: 'Cable code',
    })
    @IsString()
    @IsNotEmpty()
    cableCode: string;

    @ApiProperty({
        example: 900,
        description: 'Drum length',
    })
    @Type(() => Number)
    @IsNumber()
    length: number;

    @ApiProperty({
        example: 50,
        description: 'LSL Spec',
    })
    @Type(() => Number)
    @IsNumber()
    lslSpec: number;

    @ApiProperty({
        example: '15234',
        description: 'Employee number',
    })
    @IsString()
    @IsNotEmpty()
    empNo: string;
}