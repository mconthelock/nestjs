import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import amecConfig from './databases/amec.config';

import { AmecModule } from './amec/amec.module';
import { AuthModule } from './auth/auth.module';
import { DocinvModule } from './docinv/docinv.module';
import { JobOrderModule } from './joborder/joborder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Comment
    }),
    TypeOrmModule.forRootAsync(amecConfig),
    AuthModule,
    AmecModule,
    DocinvModule,
    JobOrderModule,
  ],
})
export class AppModule {}
