import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetLoadLessTestDto {
    @ApiProperty({ 
        example: '01', 
        enum: ['1', '2', '01', '02'], 
        description: 'Machine code (01 or 02)' 
    })
    @IsString()
    @IsNotEmpty()
    machine: string;

    @ApiProperty({ example: '163103260178', description: 'Serial number' })
    @IsString()
    @IsNotEmpty()
    serial: string;
}