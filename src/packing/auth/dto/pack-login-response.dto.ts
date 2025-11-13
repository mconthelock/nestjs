import { ApiProperty } from '@nestjs/swagger';
import { PackUserInfoDto } from './pack-user-info.dto';

export class PackLoginResponseDto {
  @ApiProperty({ enum: ['success', 'error'], description: 'Login status' })
  status: 'success' | 'error';

  @ApiProperty({ description: 'Message for the login result' })
  message: string;

  @ApiProperty({ type: PackUserInfoDto, nullable: true, description: 'User info if login success' })
  user: PackUserInfoDto | null = null;
}
