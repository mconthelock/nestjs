import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from './entities/login.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Login, 'packingConnection')
    private readonly loginRepo: Repository<Login>,
  ) {}

  async validateUser(uid: string): Promise<{ status: string; user?: Login }> {
    const user = await this.loginRepo.findOne({ where: { uid, mrkdel: false } });

    if (!user) {
      return { status: 'User not found' };
    }

    return { status: '0', user }; // '0' คือ login success
  }
}
