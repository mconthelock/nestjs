import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from './entities/login.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Login, 'packingConnection')
    private readonly loginRepo: Repository<Login>,
  ) {}

  /**
   * Check user login
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-12
   * @param   string uid Employee ID
   * @param   string ip IP Address
   * @return  Promise
   */
  async validateUser(uid: string, ip: string): Promise<{ status: 'success' | 'error'; message: string; user: Login | null }> {
    const numEmp = Number(uid);
    if (isNaN(numEmp)) {
      return { status: 'error', message: 'Invalid user format', user: null };
    }

    const empno = this.decodeID(numEmp);
    const user = await this.loginRepo.findOne({ where: { uid: empno } });
    return user
      ? { status: 'success', message: 'Login success', user }
      : { status: 'error', message: 'User not found', user: null };
  }

  /**
   * Decode Barcode Employee ID
   * @author  Mr.Pathanapong Sokpukeaw
   * @since   2025-11-12
   * @param   number uid Barcode Employee ID
   * @return  string Decoded Employee ID (5 digits)
   */
  decodeID(uid: number): string {
    const empno = Math.floor(uid / 4) - 92;
    return empno.toString().padStart(5, '0');
  }
}
