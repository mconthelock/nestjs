import { Module } from '@nestjs/common';
import { QainsAuditService } from './qains_audit.service';
import { QainsAuditController } from './qains_audit.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QainsAudit } from './entities/qains_audit.entity';
import { QainsOAModule } from '../qains_operator_auditor/qains_operator_auditor.module';
import { FormModule } from 'src/webform/form/form.module';
import { QaFileModule } from '../../qa_file/qa_file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QainsAudit], 'amecConnection'),
    QainsOAModule,
    QaFileModule,
    FormModule
  ],
  controllers: [QainsAuditController],
  providers: [QainsAuditService],
  exports: [QainsAuditService],
})
export class QainsAuditModule {}
