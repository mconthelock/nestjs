// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UsersService } from '../amec/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string, apps: number) {
    const user = await this.UsersService.findEmp(username);
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
      user: user,
      sub: user.sempno,
    };
    return {
      access_token: this.jwtService.sign(payload),
      // expiresIn: 3600,
    };
  }
}
