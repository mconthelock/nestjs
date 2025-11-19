import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from './entities/login.entity';
import { PackLoginResponseDto } from './dto/pack-login-response.dto';
import { PackUserInfoDto } from './dto/pack-user-info.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Login, 'packingConnection')
    private readonly loginRepo: Repository<Login>,
  ) {}

  /**
   * Check user login via ValidatePackAuth stored procedure
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-13
   * @param   {string} uid Employee barcode/ID
   * @param   {string} ip Client IP address
   * @return  {Promise<PackLoginResponseDto>} Login result with status, message, and user info
   */
  async validateUser(uid: string, ip: string): Promise<PackLoginResponseDto> {
    try {
      const empCode = Number(uid);
      if (isNaN(empCode)) {
        return { status: 'error', message: 'รูปแบบรหัสพนักงานไม่ถูกต้อง', user: null };
      }

      const sessionId = `sess-${Date.now()}`;
      const empNo  = this.decodeID(empCode);
      const result = await this.loginRepo.query(
        `EXEC ValidatePackAuth @empid = @0, @ip = @1, @sessid = @2`,
        [empNo, ip, sessionId],
      );

      const row = result[0];
      if (row.errcode === '0') {
        const [userId, userName, useLocaltb] = row.errormsg.split('-');
        const user: PackUserInfoDto = { userId, userName, useLocaltb };
        return { status: 'success', message: 'Login success', user };
      } else {
        return { status: 'error', message: row.errormsg, user: null };
      }
    } catch (error) {
      throw new InternalServerErrorException('Database error: ' + error.message);
    }
  }

  /**
   * Decode Employee ID from barcode
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-13
   * @param   {number} uid Barcode Employee ID
   * @return  {string} Decoded Employee ID (5 digits)
   */
  decodeID(uid: number): string {
    const empno = Math.floor(uid / 4) - 92;
    return empno.toString().padStart(5, '0');
  }
}
