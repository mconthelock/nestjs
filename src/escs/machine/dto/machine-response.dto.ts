import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class MachineResultDto {
    @ApiProperty({ example: 'PULL' })
    @IsString()
    mcType: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    mcNo: number;

    @ApiProperty({
        example: 'Data Source=PULLTESTMC1_DNA\\SQLEXPRESS;Initial Catalog=MitsuEle;...',
        nullable: true,
    })
    @IsString()
    mcDatasource: string | null;

    @ApiProperty({
        example: 'PULLTESTMC1_DNA',
        nullable: true,
    })
    @IsString()
    mcName: string | null;
}

export class MachineResponseDto {
    @ApiProperty({ example: 'SUCCESS' })
    status: 'SUCCESS' | 'ERROR';

    @ApiProperty({
        example: 'Machine not found',
        nullable: true,
    })
    message: string | null;

    @ApiProperty({
        type: MachineResultDto,
        nullable: true,
    })
    data: MachineResultDto | null;
}