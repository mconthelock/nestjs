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
      username: config.get('AMEC_USER'),
      password: config.get('AMEC_PASSWORD'),
      connectString: `${config.get('AMEC_HOST')}:${config.get('AMEC_PORT')}/${config.get('AMEC_SERVICE')}`,
      entities: [__dirname + '/../amec/**/*.entity{.ts,.js}'],
      synchronize: false,
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
