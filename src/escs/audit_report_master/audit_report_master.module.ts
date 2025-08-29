import { Module } from '@nestjs/common';
import { ESCSARMService } from './audit_report_master.service';
import { ESCSARMController } from './audit_report_master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditReportMaster } from './entities/audit_report_master.entity';
import { ESCSARRModule } from '../audit_report_revision/audit_report_revision.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditReportMaster], 'amecConnection'),
    ESCSARRModule,
  ],
  controllers: [ESCSARMController],
  providers: [ESCSARMService],
  exports: [ESCSARMService],
})
export class ESCSARMModule {}
