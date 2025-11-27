import { Module } from '@nestjs/common';
import { redisProvider, redisSubProvider } from './redis.provider';
import { TestService } from './redis.service';
import { testcontroller } from './redis.controller';

@Module({
  controllers: [testcontroller],
  providers: [redisProvider, redisSubProvider, TestService],
  exports: [redisProvider, redisSubProvider, TestService],
})
export class RedisModule {}