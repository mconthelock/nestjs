// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../amec/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UsersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // payload คือข้อมูลที่ถูกถอดรหัสจาก JWT
    // คุณสามารถเพิ่มการตรวจสอบเพิ่มเติมได้ที่นี่ เช่น ตรวจสอบว่าผู้ใช้ยังมีอยู่ในระบบหรือไม่
    const user = await this.UsersService.findEmp(payload.sub); // 'sub' (subject) มักใช้เก็บ user ID
    if (!user) {
      throw new UnauthorizedException('You have no permission to access data.');
    }
    // ค่าที่ return จาก method นี้จะถูก inject เข้าไปใน request.user
    // คุณสามารถเลือกได้ว่าจะ return อะไร เช่น object ผู้ใช้ทั้งหมด หรือแค่บางส่วน
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
