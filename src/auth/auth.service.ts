// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UsersService } from '../amec/users/users.service';
import { AppsusersService } from '../docinv/appsusers/appsusers.service';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private Appsuser: AppsusersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string, apps: number) {
    const user = await this.UsersService.findEmp(username);
    if (!user) return null;

    const md5Hash = crypto.createHash('md5').update(pass).digest('hex');
    if (md5Hash != user.SPASSWORD1) return null;
    return await this.Appsuser.verifyLogin(username, apps);
  }

  async login(user: any) {
    const payload = {
      user: user,
      sub: user.sempno,
    };
    return {
      access_token: this.jwtService.sign(payload), //expiresIn: 3600,
    };
  }
}
