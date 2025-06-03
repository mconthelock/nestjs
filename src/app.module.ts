import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import amecConfig from './databases/amec.config';

import { AmecModule } from './amec/amec.module';
import { AuthModule } from './auth/auth.module';
// import { JobOrderModule } from './job-order/job-order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Comment
    }),
    TypeOrmModule.forRootAsync(amecConfig),
    AuthModule,
    AmecModule,
    // JobOrderModule,
  ],
})
export class AppModule {}
