import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PackPISDto {
    @ApiProperty({ 
        description: 'VIS Code',
        example: '07C198A95807', 
    })
    @IsString() 
    @IsNotEmpty()
    vis: string;

    @ApiProperty({ 
        description: 'PIS Code',
        example: '8A9580711501-0001', 
    })
    @IsString() 
    @IsNotEmpty()
    pis: string;

    @ApiProperty({ example: '15234' })
    @IsString()
    @IsNotEmpty()
    userId: string;
}
