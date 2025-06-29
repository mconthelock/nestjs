// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class directLoginDto {
  @ApiProperty({ example: '4EHOIAAAUDF78222685WWLOC8798' })
  @IsNotEmpty({ message: 'Please input username' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNotEmpty({ message: '' })
  @IsNumber()
  appid!: number;
}
