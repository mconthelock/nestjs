// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '12069' })
  @IsNotEmpty({ message: 'Please input username' })
  @IsString()
  username!: string; // รับ 'username' จาก client

  @ApiProperty({ example: '******' })
  @IsNotEmpty({ message: 'Please input password' })
  @IsString()
  password!: string; // รับ 'password' จาก client

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNotEmpty({ message: '' })
  @IsNumber()
  appid!: number;
}
