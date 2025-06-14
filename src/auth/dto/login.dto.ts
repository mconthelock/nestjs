// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginDto {
  @IsNotEmpty({ message: 'Username ห้ามว่าง' })
  @IsString()
  username!: string; // รับ 'username' จาก client

  @IsNotEmpty({ message: 'Password ห้ามว่าง' })
  @IsString()
  password!: string; // รับ 'password' จาก client

  @Type(() => Number)
  @IsNotEmpty({ message: 'Password ห้ามว่าง' })
  @IsNumber()
  appid!: number;
}
