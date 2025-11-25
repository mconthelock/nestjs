import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { PAccessLog } from './entities/p-access-log.entity';
import { PackLoginResponseDto } from './dto/pack-login-response.dto';
import { PackUserInfoDto } from './dto/pack-user-info.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PAccessLog, 'packingConnection')
    private readonly md: Repository<PAccessLog>,
  ) {}

  /**
   * Validate user login via stored procedure and return user info
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-13
   * @param   {string} uid Employee barcode/ID
   * @param   {string} ip Client IP address
   * @return  {Promise<PackLoginResponseDto>} Login result with status, message, and user info
   */
  async validateUser(uid: string, ip: string): Promise<PackLoginResponseDto> {
    try {
      if (!/^\d+$/.test(uid)) {
        return { status: 'error', message: 'รหัสพนักงานต้องเป็นตัวเลขเท่านั้น', user: null };
      }

      const empCode = Number(uid);
      const sessionId = randomUUID();
      const empNo  = this.decodeID(empCode);
      const result = await this.md.query(
        `EXEC ValidatePackAuth @empid = @0, @ip = @1, @sessid = @2`,
        [empNo, ip, sessionId],
      );

      const row = result[0];
      if (row.errcode === '0') {
        const [userId, userName, useLocaltb] = row.errormsg.split('-');
        const user: PackUserInfoDto = { userId, userName, useLocaltb, sessionId };
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

  /**
   * Update logout log in PAccessLog table by setting endtime
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-24
   * @param   {string} userId Employee ID
   * @param   {string} sessionId Session ID
   * @return  {Promise<void>}
   */
  async updateLogout(userId: string, sessionId: string): Promise<void> {
    try {
      await this.md.createQueryBuilder()
        .update(PAccessLog)
        .set({ endtime: () => 'GETDATE()' })
        .where('usrid = :userId AND accessid = :sessionId', { userId, sessionId })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException('Error updating logout log: ' + error.message);
    }
  }
}
