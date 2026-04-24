import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StaticTestResultDto {
    @ApiProperty({ 
        example: '10.0753', 
        description: 'Resistance Motor U' 
    })
    @IsString()
    resistanceMotorU: string;

    @ApiProperty({ 
        example: '11.0756', 
        description: 'Resistance Motor V' 
    })
    @IsString()
    resistanceMotorV: string;

    @ApiProperty({ 
        example: '12.0755', 
        description: 'Resistance Motor W' 
    })
    @IsString()
    resistanceMotorW: string;

    @ApiProperty({ 
        example: '14.4500', 
        description: 'Resistance Brake L' 
    })
    @IsString()
    resistanceBrakeL: string;

    @ApiProperty({ 
        example: '15.4394', 
        description: 'Resistance Brake R' 
    })
    @IsString()
    resistanceBrakeR: string;
}

export class StaticTestResponseDto {
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
        type: StaticTestResultDto, 
        nullable: true 
    })
    data: StaticTestResultDto | null;
}