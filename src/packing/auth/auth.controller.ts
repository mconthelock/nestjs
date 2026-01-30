import { Controller, Post, Body, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { PackLoginDto } from './dto/pack-login.dto';
import { PackLogoutDto } from './dto/pack-logout.dto';
import { PackLoginResponseDto } from './dto/pack-login-response.dto';
import { PackLogoutResponseDto } from './dto/pack-logout-response.dto';
import { getClientIP } from 'src/common/utils/ip.utils';

@ApiTags('Packing Authen')
@Controller('packing/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Handle user login request and set HttpOnly cookie
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2025-11-13
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Check user login by empno' })
    @ApiBody({ type: PackLoginDto })
    @ApiResponse({ status: 200, description: 'Login result', type: PackLoginResponseDto })
    async login(
        @Body() body: PackLoginDto, 
        @Req() request: Request, 
        @Res({ passthrough: true }) response: Response
    ): Promise<PackLoginResponseDto> {
        const ip = getClientIP(request);
        return this.authService.validateUser(body.empno, ip);
    }

    /**
     * Handle user logout, update session endtime, and clear cookie
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2025-11-24
     */
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User logout and update session endtime' })
    async logout(
        @Body() body: PackLogoutDto,
        @Req() request: Request, 
        @Res({ passthrough: true }) response: Response
    ): Promise<PackLogoutResponseDto> {
        await this.authService.updateLogout(body.userId, body.sessionId);
        return { status: 'success', message: 'Logged out successfully' };
    }
}

