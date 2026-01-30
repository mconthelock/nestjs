import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class PackLogoutDto {
    @ApiProperty({ 
        description: 'Employee ID',
        example: '15234', 
    })
    @IsString()
    @Matches(/^\d+$/, { message: 'UID must be numeric' })
    @IsNotEmpty()
    readonly userId: string;

    @ApiProperty({ example: 'hdlmp0kku3t12yz0cqecmceb021714827486' })
    @IsString()
    @IsNotEmpty()
    sessionId: string;
}
