// src/auth/auth.controller.ts
import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import * as CryptoJS from 'crypto-js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req,
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginResult = await this.authService.login(req.user);
    if (loginResult && loginResult.access_token) {
      const apps = loginResult.info.apps;
      const appuser = loginResult.info.appuser;
      const appgroup = loginResult.info.appgroup;
      const auth = loginResult.info.auth;

      //Create Cookie for JWT Guards
      response.cookie(process.env.JWT_COOKIE_NAME, loginResult.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      //Create Cookie for Signin Page
      const payload = loginResult.info.payload;
      const encrypt = CryptoJS.AES.encrypt(
        `${payload.apps}-${payload.users}`,
        payload.location,
      ).toString();
      response.cookie(payload.location, encrypt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      });

      return { apps, appuser, appgroup, auth };
    } else {
      throw new UnauthorizedException('ไม่สามารถสร้าง token ได้');
    }
  }
}
