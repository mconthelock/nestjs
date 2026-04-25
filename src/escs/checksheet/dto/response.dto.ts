import { ApiProperty } from '@nestjs/swagger';

export class ChecksheetResponseDto {
    @ApiProperty({ 
        example: 'SUCCESS', 
        description: 'Response status' 
    })
    status: 'SUCCESS' | 'ERROR';

    @ApiProperty({
        example: 'ไม่พบข้อมูล',
        nullable: true,
        description: 'Message',
    })
    message: string | null;

    @ApiProperty({
        nullable: true,
        description: 'Response data',
    })
    data: any | null;
}