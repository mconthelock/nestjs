import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();
let amecConfig: TypeOrmModuleAsyncOptions;
if (process.env.HOST == 'AMEC') {
  amecConfig = {
    name: 'amecConnection',
    imports: [],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      type: 'oracle',
      username: process.env.AMEC_USER,
      password: process.env.AMEC_PASSWORD,
      connectString: `${process.env.AMEC_HOST}:${process.env.AMEC_PORT}/${process.env.AMEC_SERVICE}`,
      entities: [
        __dirname + '/../**/**/*.entity{.ts,.js}',
        __dirname + '/../**/**/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
      logging: ['query', 'error'],
      extra: {
        poolMax: 100,
        poolMin: 5,
        queueTimeout: 60000,
        queueMax: 1000,
      },
    }),
  };
} else {
  amecConfig = {
    name: 'amecConnection',
    imports: [],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      type: 'mysql',
      host: process.env.HOME_HOST,
      port: parseInt(process.env.HOME_PORT as string, 10),
      username: process.env.HOME_USER,
      password: process.env.HOME_PASSWORD,
      database: process.env.HOME_DATABASE,
      entities: [
        __dirname + '/../**/**/*.entity{.ts,.js}',
        __dirname + '/../**/**/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
    }),
  };
}
export default amecConfig;
