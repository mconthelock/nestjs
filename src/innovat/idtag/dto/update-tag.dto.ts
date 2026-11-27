import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateTagDto {
    @ApiProperty({
        example: '15234',
        description: 'Employee No.',
    })
    @IsString()
    @IsNotEmpty()
    empno: string;

    @ApiProperty({
        example: 'CYYYYXXXXXX',
        description: 'Control No.',
    })
    @IsString()
    @IsNotEmpty()
    controlno: string;

    @ApiProperty({
        example: 'G2PB99',
        description: 'Process Code',
    })
    @IsString()
    @IsNotEmpty()
    process: string;

    @ApiPropertyOptional({
        example: '20/11/2026',
        description: 'Finish Date (dd/MM/yyyy)',
    })
    @IsString()
    @IsOptional()
    findate?: string;
}