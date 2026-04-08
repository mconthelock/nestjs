import { Module } from '@nestjs/common';
import { AuditReportHistoryService } from './audit_report_history.service';
import { AuditReportHistoryController } from './audit_report_history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AUDIT_REPORT_HISTORY } from 'src/common/Entities/escs/table/AUDIT_REPORT_HISTORY.entity';
import { AuditReportHistoryRepository } from './audit_report_history.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([AUDIT_REPORT_HISTORY], 'escsConnection'),
    ],
    controllers: [AuditReportHistoryController],
    providers: [AuditReportHistoryService, AuditReportHistoryRepository],
    exports: [AuditReportHistoryService],
})
export class AuditReportHistoryModule {}
