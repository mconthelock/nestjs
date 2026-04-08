import { Module } from '@nestjs/common';
import { AuditReportMasterAllService } from './audit_report_master_all.service';
import { AuditReportMasterAllController } from './audit_report_master_all.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditReportRevisionModule } from '../audit_report_revision/audit_report_revision.module';
import { AuditReportMasterAllRepository } from './audit_report_master_all.repository';
import { AUDIT_REPORT_MASTER_ALL } from 'src/common/Entities/escs/views/AUDIT_REPORT_MASTER_ALL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AUDIT_REPORT_MASTER_ALL], 'escsConnection'),
        AuditReportRevisionModule,
    ],
    controllers: [AuditReportMasterAllController],
    providers: [AuditReportMasterAllService, AuditReportMasterAllRepository],
    exports: [AuditReportMasterAllService],
})
export class AuditReportMasterAllModule {}
