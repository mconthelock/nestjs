import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';

dotenv.config();
let docinvConfig: TypeOrmModuleAsyncOptions;
if (process.env.HOST == 'AMEC') {
  docinvConfig = {
    name: 'docinvConnection',
    imports: [],
    inject: [ConfigService, WINSTON_MODULE_PROVIDER],
    useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
      // inject: [ConfigService],
      // useFactory: async (config: ConfigService) => ({
      type: 'oracle',
      username: process.env.DOCINV_USER,
      password: process.env.DOCINV_PASSWORD,
      //connectString: `${process.env.DOCINV_HOST}:${process.env.DOCINV_PORT}/${process.env.DOCINV_SERVICE}?expire_time=5`,
      connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DOCINV_HOST})(PORT=${process.env.DOCINV_PORT}))(CONNECT_DATA=(SID=${process.env.DOCINV_SERVICE})))`,
      entities: [
        __dirname + '/../../**/**/*.entity{.ts,.js}',
        __dirname + '/../../**/**/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
      //   logging: ['error'],
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
  docinvConfig = {
    name: 'docinvConnection',
    imports: [],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      type: 'mysql',
      host: process.env.HOME_HOST,
      port: parseInt(process.env.HOME_PORT as string, 10),
      username: process.env.HOME_USER,
      password: process.env.HOME_PASSWORD,
      database: process.env.DOCINV_DATABASE,
      entities: [
        __dirname + '/../../**/**/*.entity{.ts,.js}',
        __dirname + '/../../**/**/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
    }),
  };
}
export default docinvConfig;
