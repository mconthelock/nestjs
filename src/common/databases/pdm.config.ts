import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';

dotenv.config();
let pdmConfig: TypeOrmModuleAsyncOptions;
if (process.env.HOST == 'AMEC') {
  pdmConfig = {
    name: 'pdmConnection',
    imports: [],
    inject: [ConfigService, WINSTON_MODULE_PROVIDER],
    useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
      // inject: [ConfigService],
      // useFactory: async (config: ConfigService) => ({
      
      type: 'postgres',
      host: process.env.PDM_HOST,
      port: +process.env.PDM_PORT,
      username: process.env.PDM_USER,
      password: process.env.PDM_PASSWORD,
      database: process.env.PDM_SERVICE,   // ถ้า PDM_SERVICE = ชื่อ DB
      schema: process.env.PDM_SCHEMA,
      entities: [
        __dirname + '/../../ids/exp-local-pdm/entities/**/*.entity{.ts,.js}'
      ],
      synchronize: false,
      logger: new TypeOrmWinstonLogger(winstonLogger),
      retryAttempts: 5,
      retryDelay: 2000,
      extra: {
        keepAlive: true,
        poolMax: +process.env.DB_POOL_MAX || 10,
        poolMin: +process.env.DB_POOL_MIN || 1,
        poolTimeout: 120,
        queueTimeout: 60000,
        queueMax: 1000,
        enableTCPSKeepAlive: true,
        poolIncrement: 5,
        poolPingInterval: 60,
        stmtCacheSize: 50,
      },
    }),
  };
} else {
  pdmConfig = {
    name: 'pdmConnection',
    imports: [],
    inject: [ConfigService, WINSTON_MODULE_PROVIDER],
    useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
      type: 'mysql',
      host: process.env.HOME_HOST,
      port: parseInt(process.env.HOME_PORT as string, 10),
      username: process.env.HOME_USER,
      password: process.env.HOME_PASSWORD,
      database: process.env.AMEC_DATABASE,
      entities: [
        __dirname + '/../../**/**/*.entity{.ts,.js}',
        __dirname + '/../../**/**/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
      logger: new TypeOrmWinstonLogger(winstonLogger),
    }),
  };
}
export default pdmConfig;
