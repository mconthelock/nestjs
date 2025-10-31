import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

//Database Configs
import amecConfig from './common/databases/amec.config';
import spsysConfig from './common/databases/spsys.config';
import docinvConfig from './common/databases/docinv.config';
import webformConfig from './common/databases/webform.config';
import invoiceConfig from './common/databases/invoice.config';

//Winston Logger
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston.config';
import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';

//Middleware
import { IpLoggerMiddleware } from './middleware/ip-logger.middleware';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { RequestContextMiddleware } from './middleware/request-context.middleware';

//Master Modules
import { AuthModule } from './auth/auth.module';
import { AmecMfgModule } from './amecmfg/amecmfg.module';
import { AmecModule } from './amec/amec.module';
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
import { FilesModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { LoggerModule } from './logger/logger.module';
import { AutomationModule } from './automation/automation.module';
import { PDFModule } from './pdf/pdf.module';
import { HradminModule } from './hradmin/hradmin.module';
import { InvoiceModule } from './invoice/invoice.module';
import { SpecialuserModule } from './itgc/specialuser/specialuser.module';
import { MatrixItemMasterModule } from './ids/matrix/matrix-item-master/matrix-item-master.module';
import { MatrixSectionModule } from './ids/matrix/matrix-section/matrix-section.module';
import { MatrixEffectItemModule } from './ids/matrix/matrix-effect-item/matrix-effect-item.module';
import { MatrixEffectViewModule } from './ids/matrix/matrix-effect-view/matrix-effect-view.module';
import auditConfig from './common/databases/auditDB.config';
import idsConfig from './common/databases/dailyids.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(amecConfig),
    TypeOrmModule.forRootAsync(spsysConfig),
    TypeOrmModule.forRootAsync(docinvConfig),
    TypeOrmModule.forRootAsync(webformConfig),
    TypeOrmModule.forRootAsync(invoiceConfig),
    TypeOrmModule.forRootAsync(auditConfig),
    TypeOrmModule.forRootAsync(idsConfig),
    //Logging Config
    WinstonModule.forRoot(winstonConfig),
    //BB8 💣
    AuthModule,
    AmecModule,
    AmecMfgModule,
    DocinvModule,
    gpreportModule,
    WebformModule,
    SpModule,
    MktModule,
    ItemarrnglstModule,
    HeaderModule,
    DetailModule,
    AS400Module,
    AutomationModule,
    HradminModule,
    LoggerModule,
    //JB 🤴
    JobOrderModule,
    FilesModule,
    ESCSModule,
    PDFModule,
    PisModule,
    MailModule,
    PisModule,
    ESCSModule,
    InvoiceModule,
    SpecialuserModule,
    MatrixItemMasterModule,
    MatrixSectionModule,
    MatrixEffectItemModule,
    MatrixEffectViewModule,
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
