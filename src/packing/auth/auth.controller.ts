import { Controller, Post, Body, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PackLoginDto } from './dto/pack-login.dto';
import { PackLoginResponseDto } from './dto/pack-login-response.dto';
import { Request, Response } from 'express';
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
      response.cookie('packinguser', JSON.stringify(result.user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",         
        sameSite: 'lax'
      });
    }

    return result;
  }
}





// @Get('profile')
// getProfile(@Req() req: Request) {
//   const userCookie = req.cookies['packingUser'];
//   if (!userCookie) return { status: 'error', message: 'Not logged in' };
//   const user = JSON.parse(userCookie);
//   return { status: 'success', user };
// }

