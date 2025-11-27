import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS = 'REDIS_CLIENT';
export const REDIS_SUB = 'REDIS_SUB_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS,
  useFactory: (): Redis => {
    const client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    });

    client.on('connect', () => {
      console.log(`[Redis:${process.pid}] connected (provider)`)
    });

    client.on('error', (err) => {
      console.error(`[Redis:${process.pid}] error`, err);
    });

    return client;
  },
};

export const redisSubProvider: Provider = {
  provide: REDIS_SUB,
  useFactory: (): Redis => {
    const sub = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    });
    sub.on('connect', () => {
      console.log(`[Redis:${process.pid}] connected (subscriber)`)
    });

    sub.on('error', (err) => {
      console.error(`[Redis:${process.pid}] error (subscriber)`, err);
    });
    return sub;
  },
};
