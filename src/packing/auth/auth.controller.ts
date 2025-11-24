import { Controller, Post, Body, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { PackLoginDto } from './dto/pack-login.dto';
import { PackLoginResponseDto } from './dto/pack-login-response.dto';
import { getClientIP } from 'src/common/utils/ip.utils';

@ApiTags('Packing Authen')
@Controller('packing/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handle user login request and set HttpOnly cookie
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-13
   * @param   {PackLoginDto} packLoginDto User login payload
   * @param   {Request} request HTTP request for getting client IP
   * @param   {Response} response HTTP response to set cookie
   * @return  {Promise<PackLoginResponseDto>} Login result with status and message
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check user login by UID' })
  @ApiBody({ type: PackLoginDto })
  @ApiResponse({ status: 200, description: 'Login result', type: PackLoginResponseDto })
  async login(@Body() packLoginDto: PackLoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<PackLoginResponseDto> {
    const ip = getClientIP(request);
    const result = await this.authService.validateUser(packLoginDto.uid, ip);
    if (result.status === 'success' && result.user) {
      response.cookie('NodeJS.Packinguser', JSON.stringify(result.user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",         
        sameSite: 'lax'
      });
    }

    return result;
  }

  /**
   * Handle user logout, update session endtime, and clear cookie
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-24
   * @param   {Request} request HTTP request to read cookie
   * @param   {Response} response HTTP response to clear cookie
   * @return  {Promise<{status: string, message: string}>} Logout result
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout and update session endtime' })
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const cookie = request.cookies['NodeJS.Packinguser'];
    if (cookie) {
      const user = JSON.parse(cookie);
      await this.authService.updateLogout(user.userId, user.sessionId);
      response.clearCookie('NodeJS.Packinguser');
    }
    return { status: 'success', message: 'Logged out successfully' };
  }
}



