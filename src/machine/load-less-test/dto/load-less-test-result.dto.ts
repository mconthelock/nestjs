import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoadLessTestResultDto {
    @ApiProperty({
        example: '0.1234',
        description: 'Induced voltage constant (V/rpm)'
    })
    @IsString()
    inducedVoltageConstant: string;
}

export class LoadLessTestResponseDto {
    @ApiProperty({ 
        example: 'OK', 
        description: 'Response status' 
    })
    status: 'OK' | 'NO_DATA' | 'FILE_NOT_FOUND';

    @ApiProperty({ 
        type: LoadLessTestResultDto, 
        nullable: true
    })
    data: LoadLessTestResultDto | null;
}