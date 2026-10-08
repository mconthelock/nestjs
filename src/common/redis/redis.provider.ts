import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS = 'REDIS_CLIENT';
export const REDIS_SUB = 'REDIS_SUB_CLIENT';

const createRedisClient = () => {
  const client = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,

    connectTimeout: 10000,
    keepAlive: 10000,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    autoResendUnfulfilledCommands: true,

    retryStrategy(times) {
      return Math.min(times * 200, 2000);
    },

    reconnectOnError(err) {
      if (err.message.includes('ECONNRESET')) return true;
      if (err.message.includes('READONLY')) return true;
      return false;
    },
  });

  client.on('connect', () => console.log(`[Redis:${process.pid}][DB:${process.env.REDIS_DB}] connected`));
  client.on('error', (err) =>
    console.error(`[Redis:${process.pid}][DB:${process.env.REDIS_DB}] error`, err),
  );
  client.on('reconnecting', (delay) =>
    console.log(`[Redis:${process.pid}][DB:${process.env.REDIS_DB}] reconnecting in ${delay}ms`),
  );
  return client;
};

export const redisProvider: Provider = {
  provide: REDIS,
  useFactory: () => createRedisClient(),
};

export const redisSubProvider: Provider = {
  provide: REDIS_SUB,
  useFactory: () => createRedisClient(),
};