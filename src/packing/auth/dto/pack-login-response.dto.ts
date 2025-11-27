import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { PackUserInfoDto } from './pack-user-info.dto';

export class PackLoginResponseDto {
  @ApiProperty({ 
    enum: ['success', 'error'], 
    description: 'Login status: success or error' 
  })
  @IsEnum(['success', 'error'])
  status: 'success' | 'error';

  @ApiProperty({ description: 'Message for the login result' })
  @IsString()
  message: string;

  @ApiProperty({ 
    type: PackUserInfoDto, 
    nullable: true, 
    required: false,
    description: 'User info if login success'
  })
  @IsOptional()
  user?: PackUserInfoDto | null = null;
}
