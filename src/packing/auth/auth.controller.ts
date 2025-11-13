import { Controller, Post, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Request } from 'express';
import { getClientIP } from 'src/common/utils/ip.utils';

@ApiTags('Packing Authen')
@Controller('packing/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handle user login request
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-13
   * @param   {LoginDto} loginDto User login payload
   * @param   {Request} req HTTP request for getting client IP
   * @return  {Promise<LoginResponseDto>} Login result with status and message
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check user login by UID' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login result', type: LoginResponseDto })
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<LoginResponseDto> {
    const ip = getClientIP(req);
    return this.authService.validateUser(loginDto.uid, ip);
  }
}
