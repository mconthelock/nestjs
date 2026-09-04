import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';

dotenv.config();

let iedocConfig: TypeOrmModuleAsyncOptions;

if (process.env.HOST == 'AMEC') {
  iedocConfig = {
    name: 'iedocConnection',
    imports: [],
    inject: [ConfigService, WINSTON_MODULE_PROVIDER],
    useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
      type: 'oracle',
      username: process.env.IEDOC_USER,
      password: process.env.IEDOC_PASSWORD,
      connectString: `${process.env.IEDOC_HOST}:${process.env.IEDOC_PORT}/${process.env.IEDOC_SERVICE}?expire_time=5`,
      entities: [
        __dirname + '/../Entities/iedoc/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
      logger: new TypeOrmWinstonLogger(winstonLogger),
      retryAttempts: 5,
      retryDelay: 2000,
      extra: {
        keepAlive: true,
        poolMax: +process.env.DB_POOL_MAX || 10,
        poolMin: +process.env.DB_POOL_MIN || 1,
        queueTimeout: 60000,
        queueMax: 1000,
        enableTCPSKeepAlive: true,
        poolIncrement: 1,
        poolTimeout: 300,
        poolPingInterval: 60,
        stmtCacheSize: 50,
      },
    }),
  };
} else {
  iedocConfig = {
    name: 'iedocConnection',
    imports: [],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      type: 'mysql',
      host: process.env.IEDOC_HOST,
      port: parseInt(process.env.IEDOC_PORT as string, 10),
      username: process.env.IEDOC_USER,
      password: process.env.IEDOC_PASSWORD,
      database: process.env.IEDOC_DATABASE,
      entities: [
        __dirname + '/../Entities/iedoc/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
    }),
  };
}

export default iedocConfig;