import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS,
  useFactory: () => {
    const client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    });

    client.on('connect', () => {
      console.log('[Redis] connected');
    });

    client.on('error', (err) => {
      console.error('[Redis] error', err);
    });

    return client;
  },
};
