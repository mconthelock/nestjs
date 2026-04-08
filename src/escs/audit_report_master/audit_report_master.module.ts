import { Module } from '@nestjs/common';
import { AuditReportMasterService } from './audit_report_master.service';
import { AuditReportMasterController } from './audit_report_master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditReportRevisionModule } from '../audit_report_revision/audit_report_revision.module';
import { AuditReportHistoryModule } from '../audit_report_history/audit_report_history.module';
import { AuditReportMasterAllModule } from '../audit_report_master_all/audit_report_master_all.module';
import { AUDIT_REPORT_MASTER } from 'src/common/Entities/escs/table/AUDIT_REPORT_MASTER.entity';
import { AuditReportMasterRepository } from './audit_report_master.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([AUDIT_REPORT_MASTER], 'escsConnection'),
        AuditReportRevisionModule,
        AuditReportHistoryModule,
        AuditReportMasterAllModule,
    ],
    controllers: [AuditReportMasterController],
    providers: [AuditReportMasterService, AuditReportMasterRepository],
    exports: [AuditReportMasterService],
})
export class AuditReportMasterModule {}
