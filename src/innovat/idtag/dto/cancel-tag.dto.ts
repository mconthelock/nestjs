import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelTagDto {
    @ApiProperty({
        example: 'CYYYYXXXXXX',
        description: 'Control No.',
    })
    @IsString()
    @IsNotEmpty()
    controlno: string;

    @ApiProperty({
        example: 'G2PB99',
        description: 'Process Code',
    })
    @IsString()
    @IsNotEmpty()
    process: string;

    @ApiProperty({
        example: '15234',
        description: 'Employee No.',
    })
    @IsString()
    @IsNotEmpty()
    empno: string;
}