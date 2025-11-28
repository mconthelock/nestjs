import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

//Middleware & Interceptor
import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';
import { IpLoggerMiddleware } from './middleware/ip-logger.middleware';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { RequestContextMiddleware } from './middleware/request-context.middleware';

//Modules List
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AmecMfgModule } from './amecmfg/amecmfg.module';
import { AmecModule } from './amec/amec.module';
import { DocinvModule } from './docinv/docinv.module';
import { gpreportModule } from './gpreport/gpreport.module';
import { WebformModule } from './webform/webform.module';
import { SpModule } from './spprogram/sp.module';
import { MktModule } from './marketing/mkt.module';
import { JobOrderModule } from './joborder/joborder.module';
import { ESCSModule } from './escs/escs.module';
import { AutomationModule } from './automation/automation.module';
import { HradminModule } from './hradmin/hradmin.module';
import { InvoiceModule } from './invoice/invoice.module';
import { IdsModule } from './ids/ids.module';
import { ElmesModule } from './elmes/elmes.module';
import { ItgcModule } from './itgc/itgc.module';
import { AS400Module } from './as400/as400.module';
import { PackingModule } from './packing/packing.module';
import { ChemicalSectionModule } from './safety/chemical/chemical-section/chemical-section.module';
import { HbdModule } from './hbd/hbd.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,

    //BB8 💣
    AuthModule,
    AmecModule,
    AmecMfgModule,
    DocinvModule,
    gpreportModule,
    WebformModule,
    SpModule,
    MktModule,
    ElmesModule,
    //AS400Module,
    AutomationModule,
    HradminModule,
    //JB 🤴
    JobOrderModule,
    ESCSModule,
    PackingModule,
    InvoiceModule,
    IdsModule,
    ItgcModule,
    ChemicalSectionModule,
    HbdModule,
  ],
  providers: [HttpLoggingInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, IpLoggerMiddleware, RequestContextMiddleware)
      .forRoutes('*');
  }
}
