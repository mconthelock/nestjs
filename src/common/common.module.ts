import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';

import { GenerateIdService } from './services/generate_id.service';
import { winstonConfig } from './logger/winston.config';

//MSSQL
import auditConfig from './databases/auditDB.config';
import lnConfig from './databases/ln.config';
import packingConfig from './databases/packingsys.config';
import fingerConfig from './databases/fingerdb.config';

//ORACLE
import mitsuConfig from './databases/mitsu.config';
import datacenterConfig from './databases/datacenter.config';
import elmesConfig from './databases/elmes.config';

//postgres
import pdmConfig from './databases/pdm.config';

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

        TypeOrmModule.forRootAsync(auditConfig),
        TypeOrmModule.forRootAsync(lnConfig),
        TypeOrmModule.forRootAsync(packingConfig),
        TypeOrmModule.forRootAsync(fingerConfig),

        TypeOrmModule.forRootAsync(mitsuConfig),
        TypeOrmModule.forRootAsync(datacenterConfig),
        TypeOrmModule.forRootAsync(elmesConfig),

        TypeOrmModule.forRootAsync(pdmConfig),
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
