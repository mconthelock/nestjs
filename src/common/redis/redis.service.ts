import { Inject, Injectable } from '@nestjs/common';
import { REDIS } from '../redis/redis.provider';
import Redis from 'ioredis';

@Injectable()
export class TestService {
  constructor(
    @Inject(REDIS) private redis: Redis,
  ) {}

  async test() {
    await this.redis.set('hello', 'test');
    const v = await this.redis.get('hello');
    console.log('ค่าจาก redis:', v);
  }
}