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

import { SpModule } from './spprogram/sp.module';
import { MktModule } from './marketing/mkt.module';

import { JobOrderModule } from './joborder/joborder.module';
import { PisModule } from './pis/pis.module';
import { ESCSModule } from './escs/escs.module';
import { DetailModule } from './idtag/detail/detail.module';
import { ItemarrnglstModule } from './elmes/itemarrnglst/itemarrnglst.module';


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
    WebformModule,
    HeaderModule,
    SpModule,
    MktModule,
    AS400Module,
    //JB 🤴
    JobOrderModule,
    PisModule,
    ESCSModule,
    DetailModule,
    ItemarrnglstModule,
  ],
})
export class AppModule {}
