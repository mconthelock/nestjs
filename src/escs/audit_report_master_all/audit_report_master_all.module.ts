import { Module } from '@nestjs/common';
import { ESCSARMAService } from './audit_report_master_all.service';
import { ESCSARMAController } from './audit_report_master_all.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditReportMasterAll } from './entities/audit_report_master_all.entity';
import { ESCSARRModule } from '../audit_report_revision/audit_report_revision.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditReportMasterAll], 'amecConnection'),
    ESCSARRModule,
  ],
  controllers: [ESCSARMAController],
  providers: [ESCSARMAService],
  exports: [ESCSARMAService],
})
export class ESCSARMAModule {}
