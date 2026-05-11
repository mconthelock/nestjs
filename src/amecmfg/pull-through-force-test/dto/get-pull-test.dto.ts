import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetPullTestDto {
    @ApiProperty({ 
        example: 'EOAD00055', 
        description: 'Order number' 
    })
    @IsString()
    @IsNotEmpty()
    order: string;

    @ApiProperty({ 
        example: 'PULLTESTMC1_DNA', 
        description: 'Machine name' 
    })
    @IsString()
    @IsNotEmpty()
    machineName: string;

    @ApiProperty({ 
        example: 'CAR', 
        enum: ['CAR', 'CWT'], 
        description: 'Type model (CAR | CWT)'  
    })
    @IsString()
    @IsNotEmpty()
    typeModel: string;
}