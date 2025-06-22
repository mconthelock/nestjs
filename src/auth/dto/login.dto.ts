// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginDto {
  @IsNotEmpty({ message: 'Please input username' })
  @IsString()
  username!: string; // รับ 'username' จาก client

  @IsNotEmpty({ message: 'Please input password' })
  @IsString()
  password!: string; // รับ 'password' จาก client

  @Type(() => Number)
  @IsNotEmpty({ message: '' })
  @IsNumber()
  appid!: number;
}
