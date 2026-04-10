import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ClearBlockDto {
    @ApiProperty({ 
        description: 'Order Number',
        example: 'E1234567', 
    })
    @IsString()
    @IsNotEmpty()
    orderno: string;

    @ApiProperty({ 
        description: 'Block Number',
        example: 'A1', 
    })
    @IsString()
    @IsNotEmpty()
    block: string;
}