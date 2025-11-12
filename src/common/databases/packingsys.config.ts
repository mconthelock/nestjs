import * as dotenv from 'dotenv';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';
dotenv.config();

let packingConfig: TypeOrmModuleAsyncOptions;
if (process.env.HOST == 'AMEC') {
  packingConfig = {
    name: 'packingConnection',
    imports: [],
    inject: [ConfigService, WINSTON_MODULE_PROVIDER],
    useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
      type: 'mssql',
      host: process.env.PACKING_HOST,
      port: 1433,
      username: process.env.PACKING_USER,
      password: process.env.PACKING_PASSWORD,
      database: process.env.PACKING_DATABASE,
      entities: [__dirname + '/../../packing/**/*.entity{.ts,.js}'],
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
        pool: {
          max: 100,
          min: 5,
          idleTimeoutMillis: 30000,
        },
        requestTimeout: 60000,
      },
    }),
  };
} else {
  packingConfig = {
    name: 'packingConnection',
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

export default packingConfig;
