import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetLatestControlNoDto {
    @ApiProperty({
        example: 'C6081100DWA',
        description: 'Control No',
    })
    @IsString()
    @IsNotEmpty()
    ctrlno: string;
}