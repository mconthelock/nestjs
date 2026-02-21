import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class WMSUploadIssueDto {
    @ApiProperty({
        example: 'AB03404',
        description: 'Location code',
    })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({
        example: '250088494',
        description: 'Pallet ID',
    })
    @IsString()
    @IsNotEmpty()
    palletId: string;

    @ApiProperty({
        example: '-',
        description: 'Expire date',
    })
    @IsString()
    @IsNotEmpty()
    expireDate: string;
}