import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PullTestResultDto {
    @ApiProperty({ example: '123456' })
    @IsString()
    orderNo: string;

    @ApiProperty({ example: '3' })
    @IsString()
    repeatNo: string;

    @ApiProperty({ example: '150.25' })
    @IsString()
    pullValue: string;

    @ApiProperty({ example: 'OK' })
    @IsString()
    result: string;

    @ApiProperty({ example: 'Tester01' })
    @IsString()
    tester: string;

    @ApiProperty({ example: '45.5' })
    @IsString()
    springLength: string;
}