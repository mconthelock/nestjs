import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PackLoginDto {
  @ApiProperty({ example: '15234', description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  readonly uid: string;
}
