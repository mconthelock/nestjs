import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';

dotenv.config();
let spsysConfig: TypeOrmModuleAsyncOptions;
spsysConfig = {
  name: 'spsysConnection',
  imports: [],
  inject: [ConfigService, WINSTON_MODULE_PROVIDER],
  useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
    type: 'oracle',
    username: process.env.SP_USER,
    password: process.env.SP_PASSWORD,
    connectString: `${process.env.SP_HOST}:${process.env.SP_PORT}/${process.env.SP_SERVICE}?expire_time=5`,
    entities: [
      __dirname + '/../../**/**/*.entity{.ts,.js}',
      __dirname + '/../../**/**/**/*.entity{.ts,.js}',
    ],
    synchronize: false,
    logging: ['error'],
    logger: new TypeOrmWinstonLogger(winstonLogger),
    retryAttempts: 5,
    retryDelay: 2000,
    extra: {
      poolMax: 100,
      poolMin: 5,
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

export default spsysConfig;
