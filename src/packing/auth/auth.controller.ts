import { Controller, Post, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PackLoginDto } from './dto/pack-login.dto';
import { PackLoginResponseDto } from './dto/pack-login-response.dto';
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
   * @param   {PackLoginDto} packLoginDto User login payload
   * @param   {Request} req HTTP request for getting client IP
   * @return  {Promise<PackLoginResponseDto>} Login result with status and message
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check user login by UID' })
  @ApiBody({ type: PackLoginDto })
  @ApiResponse({ status: 200, description: 'Login result', type: PackLoginResponseDto })
  async login(@Body() packLoginDto: PackLoginDto, @Req() req: Request): Promise<PackLoginResponseDto> {
    const ip = getClientIP(req);
    return this.authService.validateUser(packLoginDto.uid, ip);
  }
}
