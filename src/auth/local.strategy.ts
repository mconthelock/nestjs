// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service'; // AuthService ของคุณจะจัดการการตรวจสอบรหัสผ่าน

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, pass: string): Promise<any> {
    const user = await this.authService.validateUser(username, pass);
    if (!user) {
      throw new UnauthorizedException('ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
    }
    // object ผู้ใช้นี้จะถูกใส่ใน req.user ใน route handler ของ login
    return user;
  }
}
