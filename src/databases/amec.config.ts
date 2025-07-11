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
      username: process.env.AMEC_USER, //config.get('AMEC_USER'),
      password: process.env.AMEC_PASSWORD, //config.get('AMEC_PASSWORD'),
      //connectString: `${config.get('AMEC_HOST')}:${config.get('AMEC_PORT')}/${config.get('AMEC_SERVICE')}`,
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
      host: config.get('AMEC_HOST'),
      port: config.get<number>('AMEC_PORT'),
      username: config.get('AMEC_USER'),
      password: config.get('AMEC_PASSWORD'),
      database: config.get('AMEC_DATABASE'),
      entities: [__dirname + '/../amec/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
  };
}
export default amecConfig;
