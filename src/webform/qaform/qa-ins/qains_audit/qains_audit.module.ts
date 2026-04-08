import { Module } from '@nestjs/common';
import { QainsAuditService } from './qains_audit.service';
import { QainsAuditController } from './qains_audit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QainsOAModule } from '../qains_operator_auditor/qains_operator_auditor.module';
import { FormModule } from 'src/webform/form/form.module';
import { QaFileModule } from '../../qa_file/qa_file.module';
import { QAINS_AUDIT } from 'src/common/Entities/webform/table/QAINS_AUDIT.entity';
import { QainsAuditRepository } from './qains_audit.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([QAINS_AUDIT], 'webformConnection'),
        QainsOAModule,
        QaFileModule,
        FormModule,
    ],
    controllers: [QainsAuditController],
    providers: [QainsAuditService, QainsAuditRepository],
    exports: [QainsAuditService],
})
export class QainsAuditModule {}
