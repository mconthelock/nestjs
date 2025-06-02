// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AemployeeService } from '../amec/aemployee/aemployee.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: AemployeeService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // payload คือข้อมูลที่ถูกถอดรหัสจาก JWT
    // คุณสามารถเพิ่มการตรวจสอบเพิ่มเติมได้ที่นี่ เช่น ตรวจสอบว่าผู้ใช้ยังมีอยู่ในระบบหรือไม่
    const user = await this.usersService.findOne(payload.sub); // 'sub' (subject) มักใช้เก็บ user ID

    if (!user) {
      throw new UnauthorizedException('ผู้ใช้ไม่ได้รับอนุญาตหรือไม่พบผู้ใช้');
    }
    // ค่าที่ return จาก method นี้จะถูก inject เข้าไปใน request.user
    // คุณสามารถเลือกได้ว่าจะ return อะไร เช่น object ผู้ใช้ทั้งหมด หรือแค่บางส่วน
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    }; // ตัวอย่าง: เพิ่ม roles ถ้ามีใน payload
  }
}
