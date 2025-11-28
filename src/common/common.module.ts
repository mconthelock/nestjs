import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';

import { GenerateIdService } from './services/generate_id.service';

import amecConfig from './databases/amec.config';
import spsysConfig from './databases/spsys.config';
import docinvConfig from './databases/docinv.config';
import webformConfig from './databases/webform.config';
import invoiceConfig from './databases/invoice.config';
import auditConfig from './databases/auditDB.config';
import idsConfig from './databases/dailyids.config';
import gpreportConfig from './databases/gpreport.config';
import packingConfig from './databases/packingsys.config';
import elmesConfig from './databases/elmes.config';
import escsConfig from './databases/escs.config';
import pdmConfig from './databases/pdm.config';

import { winstonConfig } from './logger/winston.config';
import { RedisModule } from './redis/redis.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { LoggerModule } from './logger/logger.module';
import { HealthcheckService } from './services/healthcheck/healthcheck.service';
import { QrcodeModule } from './services/qrcode/qrcode.module';
import { MailModule } from './services/mail/mail.module';
import { PDFModule } from './services/pdf/pdf.module';
import { FilesModule } from './services/file/file.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WinstonModule.forRoot(winstonConfig),
    TypeOrmModule.forRootAsync(amecConfig),
    TypeOrmModule.forRootAsync(spsysConfig),
    TypeOrmModule.forRootAsync(docinvConfig),
    TypeOrmModule.forRootAsync(webformConfig),
    TypeOrmModule.forRootAsync(invoiceConfig),
    TypeOrmModule.forRootAsync(auditConfig),
    TypeOrmModule.forRootAsync(idsConfig),
    TypeOrmModule.forRootAsync(gpreportConfig),
    TypeOrmModule.forRootAsync(packingConfig),
    TypeOrmModule.forRootAsync(elmesConfig),
    TypeOrmModule.forRootAsync(escsConfig),
    TypeOrmModule.forRootAsync(pdmConfig),
    RedisModule,
    SchedulerModule,
    LoggerModule,
    QrcodeModule,
    MailModule,
    PDFModule,
    FilesModule
  ],
  providers: [GenerateIdService, HealthcheckService],
  exports: [GenerateIdService],
})
export class CommonModule {}
