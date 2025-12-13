import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export enum LoginStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum UseLocalTableFlag {
  AS400 = '0',
  LOCAL = '1',
}

export class PackLoginUserDto {
  @ApiProperty({ example: '15234' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'Pathanapong' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: '0 = AS400 data, 1 = Local data',
    enum: UseLocalTableFlag,
  })
  @IsEnum(UseLocalTableFlag)
  useLocaltb: UseLocalTableFlag;

  @ApiProperty({ example: 'hdlmp0kku3t12yz0cqecmceb021714827486' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}

export class PackLoginResponseDto {
  @ApiProperty({
    description: 'Login result status',
    enum: LoginStatus,
  })
  status: LoginStatus;

  @ApiProperty({ 
    description: 'Login result message' 
  })
  message: string;

  @ApiProperty({
    type: PackLoginUserDto,
    required: false,
    nullable: true,
  })
  user?: PackLoginUserDto;
}
