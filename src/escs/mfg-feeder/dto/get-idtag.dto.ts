import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetIdTagDto {
    @ApiProperty({
        example: 'C604270001B',
        description: 'Control Number'
    })
    @IsString()
    @IsNotEmpty()
    controlNo: string;
}