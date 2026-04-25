import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteDto {
    @ApiProperty({ example: '1777092554464_101-05-E8BE11016(1).xlsx', description: 'SharePoint file name' })
    @IsString()
    filename: string;
}