import { Module } from '@nestjs/common';
import { AuditReportRevisionService } from './audit_report_revision.service';
import { AuditReportRevisionController } from './audit_report_revision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditReportRevisionRepository } from './audit_report_revision.repository';
import { AUDIT_REPORT_REVISION } from 'src/common/Entities/escs/table/AUDIT_REPORT_REVISION.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AUDIT_REPORT_REVISION], 'escsConnection'),
    ],
    controllers: [AuditReportRevisionController],
    providers: [AuditReportRevisionService, AuditReportRevisionRepository],
    exports: [AuditReportRevisionService],
})
export class AuditReportRevisionModule {}
