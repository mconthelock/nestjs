// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AemployeeService } from '../amec/aemployee/aemployee.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private AemployeeService: AemployeeService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.AemployeeService.findOneById(username);

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.spassword);
      if (isMatch) {
        const { spassword, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.sempno,
      sub: user.sempno, // 'sub' (subject) เป็น claim มาตรฐานของ JWT สำหรับ user ID
      // roles: user.roles // ตัวอย่าง: เพิ่ม roles หากผู้ใช้ของคุณมี roles
    };
    return {
      access_token: this.jwtService.sign(payload),
      expiresIn: 3600,
      // user: { // อาจจะส่งข้อมูลผู้ใช้บางส่วนกลับไปด้วย
      //   id: user.id,
      //   username: user.username,
      //   roles: user.roles
      // }
    };
  }
}
