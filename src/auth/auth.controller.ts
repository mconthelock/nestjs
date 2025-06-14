// src/auth/auth.controller.ts
import {
  Controller,
  Request,
  Post,
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

      //Create Cookie for JWT Guards
      response.cookie(process.env.JWT_COOKIE_NAME, loginResult.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
      });

      //Create Cookie for Signin Page
      const payload = loginResult.info.payload;
      response.cookie(
        payload.location,
        CryptoJS.AES.encrypt(
          `${payload.apps}-${payload.users}`,
          payload.location,
        ).toString(),
        {
          httpOnly: true,
          //secure: process.env.NODE_ENV === 'production',
          //sameSite: 'Lax',
          expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        },
      );

      //   const jwtCookie = response.getHeader('Set-Cookie');
      //   console.log('JWT Cookie:', jwtCookie);
      //   const decryptedBytes = CryptoJS.AES.decrypt(
      //     `U2FsdGVkX1/VALeDtJWJcwlKpwyfsJRnnjXjf0qxAGg=`,
      //     payload.location,
      //   );
      //   console.log(
      //     'log',
      //     `${payload.apps}-${payload.users}`,
      //     decryptedBytes.toString(CryptoJS.enc.Utf8),
      //   );

      return { apps, appuser, appgroup };
    } else {
      throw new UnauthorizedException('ไม่สามารถสร้าง token ได้');
    }
  }
}
