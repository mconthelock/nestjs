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
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/login
  @HttpCode(HttpStatus.OK) // กำหนดให้ response status เป็น 200 OK เมื่อสำเร็จ
  @UseGuards(AuthGuard('local')) // 'local' อ้างถึง LocalStrategy ที่เราสร้าง
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    // loginDto เป็น optional ถ้าคุณใช้เฉพาะ req.user
    // req.user จะถูก populate โดย LocalStrategy.validate()
    // loginDto ใช้เพื่อให้ Swagger/OpenAPI รู้จัก request body และสำหรับการ validation (ถ้ามี)
    return this.authService.login(req.user);
  }
}

//22017 >> 92215
