import { ApiProperty } from '@nestjs/swagger';
import { Login } from '../entities/login.entity';

export class LoginResponseDto {
  @ApiProperty({ enum: ['success', 'error'], description: 'Login status' })
  status: 'success' | 'error';

  @ApiProperty({ description: 'Message for the login result' })
  message: string;

  @ApiProperty({ type: () => Login, nullable: true, description: 'User info if login success' })
  user: Login | null;
}
