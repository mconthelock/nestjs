import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GovernorTestResultDto {
    @ApiProperty({ example: '1714212345' })
    @IsString()
    timeStamp: string;

    @ApiProperty({ example: '2026-04-27' })
    @IsString()
    date: string;

    @ApiProperty({ example: '09:25:22' })
    @IsString()
    time: string;

    @ApiProperty({ example: 'E8CB37524' })
    @IsString()
    order: string;

    @ApiProperty({ example: '1' })
    @IsString()
    testId: string;

    @ApiProperty({ example: '1.234' })
    @IsString()
    os: string;

    @ApiProperty({ example: '0.987' })
    @IsString()
    tr: string;

    @ApiProperty({ example: 'OK' })
    @IsString()
    result: string;

    @ApiProperty({ example: 'EN1' })
    @IsString()
    en: string;
}