import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetLoadLessTestDto {
    @ApiProperty({
        example: 'U370804260060|EXVL41012',
        description: 'Format: serial|order'
    })
    @IsString()
    @IsNotEmpty()
    data: string;
}