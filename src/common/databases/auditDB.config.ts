import * as dotenv from 'dotenv';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';
dotenv.config();

let auditConfig: TypeOrmModuleAsyncOptions;
if (process.env.HOST == 'AMEC') {
  auditConfig = {
    name: 'auditConnection',
    imports: [],
    inject: [ConfigService, WINSTON_MODULE_PROVIDER],
    useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
      type: 'mssql',
      host: process.env.AUD_HOST,
      port: Number(process.env.AUD_PORT) || 1433,
      username: process.env.AUD_USER,
      password: process.env.AUD_PASSWORD,
      database: process.env.AUD_DATABASE || process.env.AUD_SERVICE,
      entities: [__dirname + '/../../itgc/**/*.entity{.ts,.js}'],
      synchronize: false,
      logger: new TypeOrmWinstonLogger(winstonLogger),
      retryAttempts: 5,
      retryDelay: 2000,
      options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true,
      },
      extra: {
        // connection pool options for mssql (tedious)
        pool: {
          max: 100,
          min: 5,
          // idleTimeoutMillis is a common pool option; adjust as needed
          idleTimeoutMillis: 30000,
        },
        // request timeout in ms
        requestTimeout: 60000,
      },
    }),
  };
} else {
  auditConfig = {
    name: 'auditConnection',
    imports: [],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      type: 'mysql',
      host: process.env.HOME_HOST,
      port: parseInt(process.env.HOME_PORT as string, 10),
      username: process.env.HOME_USER,
      password: process.env.HOME_PASSWORD,
      database: process.env.AUD_DATABASE,
      entities: [
        __dirname + '/../../**/**/*.entity{.ts,.js}',
        __dirname + '/../../**/**/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
    }),
  };
}

export default auditConfig;
