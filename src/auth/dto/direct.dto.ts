// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class directLoginDto {
  @IsNotEmpty({ message: 'Please input username' })
  @IsString()
  username!: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '' })
  @IsNumber()
  appid!: number;
}
