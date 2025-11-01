import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';

dotenv.config();
let idsConfig: TypeOrmModuleAsyncOptions;
if (process.env.HOST == 'AMEC') {
  idsConfig = {
    name: 'idsConnection',
    imports: [],
    inject: [ConfigService, WINSTON_MODULE_PROVIDER],
    useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
      // inject: [ConfigService],
      // useFactory: async (config: ConfigService) => ({
      type: 'oracle',
      username: process.env.IDS_USER,
      password: process.env.IDS_PASSWORD,
      connectString: `${process.env.IDS_HOST}:${process.env.IDS_PORT}/${process.env.IDS_SERVICE}?expire_time=5`,
      entities: [__dirname + '/../../ids/**/*.entity{.ts,.js}'],
      synchronize: false,
      logger: new TypeOrmWinstonLogger(winstonLogger),
      retryAttempts: 5,
      retryDelay: 2000,
      extra: {
        keepAlive: true,
        poolMax: 100,
        poolMin: 5,
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
  idsConfig = {
    name: 'idsConnection',
    imports: [],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      type: 'mysql',
      host: process.env.HOME_HOST,
      port: parseInt(process.env.HOME_PORT as string, 10),
      username: process.env.HOME_USER,
      password: process.env.HOME_PASSWORD,
      database: process.env.GPREPORT_DATABASE,
      entities: [
        __dirname + '/../../**/**/*.entity{.ts,.js}',
        __dirname + '/../../**/**/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
    }),
  };
}
export default idsConfig;
