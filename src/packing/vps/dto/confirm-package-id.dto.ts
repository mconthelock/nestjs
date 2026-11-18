import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmPackageIDDto {
    @ApiProperty({
        description: 'VIS Code',
        example: '07C118A95807'
    })
    @IsString()
    @IsNotEmpty()
    vis: string;

    @ApiProperty({
        description: 'Package ID',
        example: '07C198A95807-WB01'
    })
    @IsString()
    @IsNotEmpty()
    packageId: string;

    @ApiProperty({
        example: '15234'
    })
    @IsString()
    @IsNotEmpty()
    userId: string;
}