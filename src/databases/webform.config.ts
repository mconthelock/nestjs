import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const webformConfig: TypeOrmModuleAsyncOptions = {
  name: 'webformConnection',
  imports: [],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    type: 'mysql',
    host: config.get('WEBFORM_HOST'),
    port: config.get<number>('WEBFORM_PORT'),
    username: config.get('WEBFORM_USER'),
    password: config.get('WEBFORM_PASSWORD'),
    database: config.get('WEBFORM_DATABASE'),
    entities: [__dirname + '/../webform/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
};
