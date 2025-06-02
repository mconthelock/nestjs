// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AemployeeService } from '../amec/aemployee/aemployee.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private AemployeeService: AemployeeService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.AemployeeService.findOneBySLogin(username);
    if (user) {
      const md5Hash = crypto.createHash('md5').update(pass).digest('hex');
      if (md5Hash == user.spassword1) {
        const { spassword1, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.sempno,
      sub: user,
      // roles: user.roles // ตัวอย่าง: เพิ่ม roles หากผู้ใช้ของคุณมี roles
    };
    return {
      access_token: this.jwtService.sign(payload),
      //   user: user,
      // expiresIn: 3600,
    };
  }
}
