// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true, // enables access to req in validate
    });
  }

  async validate(req: Request, username: string, pass: string): Promise<any> {
    const appid = (req.body as any).appid;
    const ip = String((req as any).clientIp);
    const user = await this.authService.validateUser(username, pass, appid, ip);
    if (!user) {
      throw new UnauthorizedException('You nave no authorization');
    }
    return user;
  }
}
