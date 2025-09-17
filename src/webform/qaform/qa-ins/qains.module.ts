

import { Module } from '@nestjs/common';
import { QainsFormModule } from './qains_form/qains_form.module';
import { QainsOAModule } from './qains_operator_auditor/qains_operator_auditor.module';
import { QainsAuditModule } from './qains_audit/qains_audit.module';

@Module({
  imports: [QainsFormModule, QainsOAModule, QainsAuditModule],
})
export class QAInsModule {}
