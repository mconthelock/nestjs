import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username', // หรือ 'email' ขึ้นอยู่กับตาราง User ของคุณ
      // passwordField: 'password' // นี่คือค่า default
    });
  }

  async validate(username: string, pass: string): Promise<any> {
    const user = await this.authService.validateUser(username, pass);
    if (!user) {
      throw new UnauthorizedException('ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง');
    }
    return user; // object ผู้ใช้นี้จะถูกใส่ใน req.user ใน route handler ของ login
  }
}
