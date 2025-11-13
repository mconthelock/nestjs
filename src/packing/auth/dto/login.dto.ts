import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '15234', description: 'Employee ID' })
  @IsNotEmpty()
  @IsString()
  readonly uid: string;
}
