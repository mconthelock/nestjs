import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import amecConfig from './databases/amec.config';
import { webformConfig } from './databases/webform.config';

import { AmecModule } from './amec/amec.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(amecConfig),
    AuthModule,
    AmecModule,
  ],
})
export class AppModule {}
