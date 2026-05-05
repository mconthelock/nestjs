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
        example: 'SUCCESS', 
        description: 'Response status' 
    })
    status: 'SUCCESS' | 'ERROR' ;

    @ApiProperty({ 
        example: 'ไม่พบข้อมูล Test ในระบบ กรุณาลองใหม่อีกครั้ง!', 
        description: 'Error message if status is ERROR', 
        nullable: true 
    })
    message: string | null;

    @ApiProperty({ 
        type: LoadLessTestResultDto, 
        nullable: true
    })
    data: LoadLessTestResultDto | null;
}