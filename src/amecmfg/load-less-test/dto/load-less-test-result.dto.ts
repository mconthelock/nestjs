import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoadLessTestResultDto {
    @ApiProperty({
        example: '45.6',
        description: 'Suction sound level (dB)'
    })
    @IsString()
    suctionSoundDb: string;

    @ApiProperty({
        example: '50.2',
        description: 'Falling sound level (dB)'
    })
    @IsString()
    fallingSoundDb: string;

    @ApiProperty({
        example: '48.9',
        description: 'Running sound level (dB)'
    })
    @IsString()
    runningSoundDb: string;

    @ApiProperty({
        example: '65.3',
        description: 'Housing temperature (°C)'
    })
    @IsString()
    housingTemp: string;

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