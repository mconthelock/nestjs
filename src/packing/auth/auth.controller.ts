import { Controller, Post, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Login } from './entities/login.entity';
import { Request } from 'express';
import { getClientIP } from 'src/common/utils/ip.utils';

@ApiTags('Packing Authen')
@Controller('packing/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check user login by UID' })
  @ApiResponse({ status: 200, description: 'Login result', type: LoginResponseDto })
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<LoginResponseDto> {
    const ip = getClientIP(req);
    return await this.authService.validateUser(loginDto.uid);
  }
}
