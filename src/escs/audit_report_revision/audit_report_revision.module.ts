import { Module } from '@nestjs/common';
import { ESCSARRService } from './audit_report_revision.service';
import { ESCSARRController } from './audit_report_revision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditReportRevision } from './entities/audit_report_revision.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditReportRevision], 'amecConnection')],
  controllers: [ESCSARRController],
  providers: [ESCSARRService],
  exports: [ESCSARRService],
})
export class ESCSARRModule {}
