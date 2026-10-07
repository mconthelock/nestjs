import { Module } from '@nestjs/common';
import { SendVgmMeltService } from './service/send-vgm-melt.service';
import { SendVgmMeltController } from './send-vgm-melt.controller';
import { SendVgmMeltRepository } from './send-vgm-melt.repository';
import { ExportExcelService } from './service/export-excel.service';
import { MailModule } from 'src/common/services/mail/mail.module';
import { SendMailManualService } from './service/send-mail-manual.service';
import { DpmsPlMeltLogModule } from 'src/workload/dpms_pl_melt_log/dpms_pl_melt_log.module';
import { JobService } from './service/job.service';

@Module({
    imports: [MailModule, DpmsPlMeltLogModule],
    controllers: [SendVgmMeltController],
    providers: [
        SendVgmMeltService,
        ExportExcelService,
        SendMailManualService,
        JobService,
        SendVgmMeltRepository,
    ],
    exports: [SendVgmMeltService],
})
export class SendVgmMeltModule {}
