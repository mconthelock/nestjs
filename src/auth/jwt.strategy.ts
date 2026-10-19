// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../amec/users/users.service';

const cookieExtractor = (req: Request): string | null => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies[process.env.JWT_COOKIE_NAME];
    }
    //console.log(req.rawHeaders);
    //console.log('Token extracted from cookie:', token);
    return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly UsersService: UsersService,
        private readonly jwtService: JwtService,
    ) {
        super({
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const user = await this.UsersService.findEmp(payload.sub); // 'sub' (subject) มักใช้เก็บ user ID
        if (!user) {
            throw new UnauthorizedException(
                'You have no permission to access data.',
            );
        }

        // Sliding expiration: renew the cookie while the user keeps calling the API
        const refreshedToken = this.jwtService.sign({
            user: payload.user,
            sub: payload.sub,
        });
        (req as any).res?.cookie(process.env.JWT_COOKIE_NAME, refreshedToken, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return {
            userid: payload.sub,
            user: payload.user,
            //roles: payload.roles,
        };
    }
}
