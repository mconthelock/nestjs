import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';

dotenv.config();
let elmesConfig: TypeOrmModuleAsyncOptions;
if (process.env.HOST == 'AMEC') {
  elmesConfig = {
    name: 'elmesConnection',
    imports: [],
    inject: [ConfigService, WINSTON_MODULE_PROVIDER],
    useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
      // inject: [ConfigService],
      // useFactory: async (config: ConfigService) => ({
      type: 'oracle',
      username: process.env.ELMES_USER,
      password: process.env.ELMES_PASSWORD,
      connectString: `${process.env.ELMES_HOST}:${process.env.ELMES_PORT}/${process.env.ELMES_SERVICE}?expire_time=5`,
      entities: [__dirname + '/../../elmes/**/*.entity{.ts,.js}'],
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
  elmesConfig = {
    name: 'elmesConnection',
    imports: [],
    inject: [ConfigService, WINSTON_MODULE_PROVIDER],
    useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
      type: 'mysql',
      host: process.env.HOME_HOST,
      port: parseInt(process.env.HOME_PORT as string, 10),
      username: process.env.HOME_USER,
      password: process.env.HOME_PASSWORD,
      database: process.env.ELMES_DATABASE,
      entities: [
        __dirname + '/../../**/**/*.entity{.ts,.js}',
        __dirname + '/../../**/**/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
      logger: new TypeOrmWinstonLogger(winstonLogger),
    }),
  };
}
export default elmesConfig;
