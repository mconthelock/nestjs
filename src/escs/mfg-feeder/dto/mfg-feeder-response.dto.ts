import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MfgFeederResultDto {
    @ApiProperty({
        example: '14-Jul-26',
    })
    @IsString()
    INSDATE: string;

    @ApiProperty({
        example: '202605B',
    })
    @IsString()
    PROD: string;

    @ApiProperty({
        example: 'GSXL21',
    })
    @IsString()
    MODEL: string;
}

export class MfgFeederResponseDto {
    @ApiProperty({
        example: 'SUCCESS',
    })
    status: 'SUCCESS' | 'ERROR';

    @ApiProperty({
        example: 'ID-Tag not found',
        nullable: true,
    })
    message: string | null;

    @ApiProperty({
        type: MfgFeederResultDto,
        nullable: true,
    })
    data: MfgFeederResultDto | null;
}