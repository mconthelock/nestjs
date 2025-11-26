import { Module } from '@nestjs/common';
import { redisProvider } from './redis.provider';
import { TestService } from './redis.service';
import { testcontroller } from './redis.controller';

@Module({
  controllers: [testcontroller],
  providers: [redisProvider, TestService],
  exports: [redisProvider, TestService],
})
export class RedisModule {}