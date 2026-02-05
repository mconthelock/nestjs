import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PackCloseVISDto {
    @ApiProperty({ 
        description: 'VIS Code',
        example: '07C118A95807'
    })
    @IsString() 
    @IsNotEmpty()
    vis: string;

    @ApiProperty({ 
        description: 'Shipping mark',
        example: '07C198A95807-SM'
    })
    @IsString() 
    @IsNotEmpty()
    shipcode: string;

    @ApiProperty({ example: '15234' })
    @IsString()
    @IsNotEmpty()
    userId: string;
}
