import { Module } from '@nestjs/common';
import { ESCSARHService } from './audit_report_history.service';
import { ESCSARHController } from './audit_report_history.controller';
import { AuditReportHistory } from './entities/audit_report_history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuditReportHistory], 'amecConnection')],
  controllers: [ESCSARHController],
  providers: [ESCSARHService],
  exports: [ESCSARHService],
})
export class ESCSARHModule {}
