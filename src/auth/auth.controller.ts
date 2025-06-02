// src/auth/auth.controller.ts
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // สร้าง DTO สำหรับข้อมูล login

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/login
  @HttpCode(HttpStatus.OK) // กำหนดให้ response status เป็น 200 OK เมื่อสำเร็จ
  @UseGuards(AuthGuard('local')) // 'local' อ้างถึง LocalStrategy ที่เราสร้าง
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }
}
