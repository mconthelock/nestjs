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

  async validateUser(uid: string): Promise<{ status: 'success' | 'error'; message: string; user: Login | null }> {
    const user = await this.loginRepo.findOne({ 
      where: { uid } 
    });

    return user
      ? { status: 'success', message: 'Login success', user }
      : { status: 'error', message: 'User not found', user: null };
  }
}
