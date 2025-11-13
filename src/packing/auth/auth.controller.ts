import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Packing Authen')
@Controller('packing/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Check user login by UID' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.validateUser(loginDto.uid);
    return { status: result.status, user: result.user || null };
  }
}
