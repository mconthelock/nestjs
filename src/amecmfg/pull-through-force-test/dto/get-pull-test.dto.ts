import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPullTestDto {
    @ApiProperty({ 
        example: 'E8CB37524', 
        description: 'Order number' 
    })
    @IsString()
    order: string;

    @ApiProperty({ 
        example: 'PULLTESTMC1_DNA', 
        description: 'Machine name' 
    })
    @IsString()
    machineName: string;

    @ApiProperty({ 
        example: 'CAR', 
        description: 'Type model' 
    })
    @IsString()
    typeModel: string;
}