import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WMSUploadIssueResponseDto {
    @ApiProperty({
        example: 'SUCCESS',
        description: 'Result status (SUCCESS | NOTFOUND | ERROR)',
    })
    @IsString()
    STATUS: string;

    @ApiProperty({
        example: 'Update success',
        description: 'Additional message from procedure',
    })
    @IsString()
    MESSAGE: string;
}