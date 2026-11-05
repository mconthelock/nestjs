import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetMaxRunnoDto {
    @ApiProperty({
        example: 'B4CC06',
        description: 'Process Code',
    })
    @IsString()
    @IsNotEmpty()
    process: string;
}