import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import amecConfig from './databases/amec.config';

import { AuthModule } from './auth/auth.module';
import { AmecModule } from './amec/amec.module';
import { AmecMfgModule } from './amecmfg/amecmfg.module';
import { DocinvModule } from './docinv/docinv.module';
import { gpreportModule } from './gpreport/gpreport.module';
import { AS400Module } from './as400/as400.module';
import { WebformModule } from './webform/webform.module';
import { HeaderModule } from './idtag/header/header.module';

import { JobOrderModule } from './joborder/joborder.module';
import { PisModule } from './pis/pis.module';
import { ESCSModule } from './escs/escs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(amecConfig),
    //BB8 💣
    AuthModule,
    AmecModule,
    AmecMfgModule,
    DocinvModule,
    gpreportModule,
    AS400Module,
    WebformModule,
    HeaderModule,
    //JB 🤴
    JobOrderModule,
    PisModule,
    ESCSModule
  ],
})
export class AppModule {}
