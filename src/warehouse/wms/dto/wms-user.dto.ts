import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class WMSUserDto {
  @ApiProperty({ 
    description: 'Employee ID',
    example: '15234', 
  })
  @IsString()
  @IsNotEmpty()
  readonly empno: string;
}
