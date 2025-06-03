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

  async validateUser(username: string, pass: string) {
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
      username: user.sempno,
      sub: user,
    };
    return {
      access_token: this.jwtService.sign(payload),
      //   user: user,
      // expiresIn: 3600,
    };
  }
}
