// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../amec/users/users.service';

const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[process.env.JWT_COOKIE_NAME];
  }
  console.log('Token extracted from cookie:', token);
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UsersService: UsersService) {
    super({
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.UsersService.findEmp(payload.sub); // 'sub' (subject) มักใช้เก็บ user ID
    if (!user) {
      throw new UnauthorizedException('You have no permission to access data.');
    }
    return {
      userid: payload.sub,
      user: payload.user,
      //roles: payload.roles,
    };
  }
}
