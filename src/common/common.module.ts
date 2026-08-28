import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';

import { GenerateIdService } from './services/generate_id.service';
import { winstonConfig } from './logger/winston.config';

//MSSQL
import auditConfig from './databases/auditDB.config';
import invoiceConfig from './databases/invoice.config';
import lnConfig from './databases/ln.config';
import packingConfig from './databases/packingsys.config';
import fingerConfig from './databases/fingerdb.config';

//ORACLE
import amecConfig from './databases/amec.config';
import datacenterConfig from './databases/datacenter.config';
import docinvConfig from './databases/docinv.config';
import ebudgetConfig from './databases/ebudget.config';
import elmesConfig from './databases/elmes.config';
import escsConfig from './databases/escs.config';
import gpreportConfig from './databases/gpreport.config';
import idsConfig from './databases/dailyids.config';
import pdmConfig from './databases/pdm.config';
import purConfig from './databases/pursys.config';
import sdsysConfig from './databases/sdsys.config';
import spsysConfig from './databases/spsys.config';
import webformConfig from './databases/webform.config';
import workloadConfig from './databases/workload.config';

//Other Services
import { FilesModule } from './services/file/file.module';
import { HealthcheckService } from './services/healthcheck/healthcheck.service';
import { LoggerModule } from './logger/logger.module';
import { MailModule } from './services/mail/mail.module';
import { PDFModule } from './services/pdf/pdf.module';
import { QrcodeModule } from './services/qrcode/qrcode.module';
import { RedisModule } from './redis/redis.module';
import { SchedulerModule } from './scheduler/scheduler.module';
@Module({
    imports: [
        ScheduleModule.forRoot(),
        WinstonModule.forRoot(winstonConfig),
        TypeOrmModule.forRootAsync(amecConfig),
        TypeOrmModule.forRootAsync(auditConfig),
        TypeOrmModule.forRootAsync(datacenterConfig),
        TypeOrmModule.forRootAsync(docinvConfig),
        TypeOrmModule.forRootAsync(ebudgetConfig),
        TypeOrmModule.forRootAsync(elmesConfig),
        TypeOrmModule.forRootAsync(escsConfig),
        TypeOrmModule.forRootAsync(gpreportConfig),
        TypeOrmModule.forRootAsync(idsConfig),
        TypeOrmModule.forRootAsync(invoiceConfig),
        TypeOrmModule.forRootAsync(lnConfig),
        TypeOrmModule.forRootAsync(packingConfig),
        TypeOrmModule.forRootAsync(pdmConfig),
        TypeOrmModule.forRootAsync(sdsysConfig),
        TypeOrmModule.forRootAsync(spsysConfig),
        TypeOrmModule.forRootAsync(webformConfig),
        TypeOrmModule.forRootAsync(workloadConfig),
        TypeOrmModule.forRootAsync(purConfig),
        TypeOrmModule.forRootAsync(fingerConfig),
        RedisModule,
        SchedulerModule,
        LoggerModule,
        QrcodeModule,
        MailModule,
        PDFModule,
        FilesModule,
        // BackgroundTaskModule,
    ],
    providers: [GenerateIdService, HealthcheckService],
    exports: [GenerateIdService],
})
export class CommonModule {}
