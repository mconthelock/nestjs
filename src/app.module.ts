import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import amecConfig from './databases/amec.config';

import { AmecModule } from './amec/amec.module';
import { AuthModule } from './auth/auth.module';
import { DocinvModule } from './docinv/docinv.module';
import { JobOrderModule } from './joborder/joborder.module';
import { NewsModule } from './gpreport/news/news.module';
import { F001kpModule } from './as400/shopf/f001kp/f001kp.module';
import { F002kpModule } from './as400/shopf/f002kp/f002kp.module';
import { F003kpModule } from './as400/shopf/f003kp/f003kp.module';
import { PisModule } from './pis/pis.module';

import { PisGateway } from './pis/pis.gateway';

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
    NewsModule,
    F001kpModule,
    F002kpModule,
    F003kpModule,
    PisModule,
  ],
  providers: [PisGateway],
})
export class AppModule {}
