import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import amecConfig from './common/databases/amec.config';
import spsysConfig from './common/databases/spsys.config';
import docinvConfig from './common/databases/docinv.config';

import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { winstonConfig, devLoggerConfig } from './common/logger/winston.config';
import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';

import { AuthModule } from './auth/auth.module';
// import { AmecModule } from './amec/amec.module';
// import { AmecMfgModule } from './amecmfg/amecmfg.module';
import { DocinvModule } from './docinv/docinv.module';
import { gpreportModule } from './gpreport/gpreport.module';
// import { AS400Module } from './as400/as400.module';
// import { WebformModule } from './webform/webform.module';
// import { HeaderModule } from './idtag/header/header.module';
import { SpModule } from './spprogram/sp.module';
import { MktModule } from './marketing/mkt.module';
// import { JobOrderModule } from './joborder/joborder.module';
// import { PisModule } from './pis/pis.module';
// import { ESCSModule } from './escs/escs.module';
// import { DetailModule } from './idtag/detail/detail.module';
import { ItemarrnglstModule } from './elmes/itemarrnglst/itemarrnglst.module';
import { LoggerModule } from './logger/logger.module';

const logConfig =
  process.env.STATE === 'development' ? devLoggerConfig : winstonConfig;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(amecConfig),
    TypeOrmModule.forRootAsync(spsysConfig),
    TypeOrmModule.forRootAsync(docinvConfig),
    //BB8 💣
    AuthModule,
    // AmecModule,
    // AmecMfgModule,
    DocinvModule,
    gpreportModule,
    // WebformModule,
    // HeaderModule,
    SpModule,
    MktModule,
    // AS400Module,
    //JB 🤴
    // JobOrderModule,
    // PisModule,
    // ESCSModule,
    // DetailModule,
    ItemarrnglstModule,

    //Logging Config
    WinstonModule.forRoot(logConfig),
    LoggerModule,
  ],
  providers: [HttpLoggingInterceptor],
})
export class AppModule {}
