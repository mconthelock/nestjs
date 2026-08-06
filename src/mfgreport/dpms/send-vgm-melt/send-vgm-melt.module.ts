import { Module } from '@nestjs/common';
import { SendVgmMeltService } from './service/send-vgm-melt.service';
import { SendVgmMeltController } from './send-vgm-melt.controller';
import { SendVgmMeltRepository } from './send-vgm-melt.repository';
import { ExportExcelService } from './service/export-excel.service';

@Module({
    controllers: [SendVgmMeltController],
    providers: [SendVgmMeltService, ExportExcelService, SendVgmMeltRepository],
    exports: [SendVgmMeltService],
})
export class SendVgmMeltModule {}
