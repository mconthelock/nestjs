

import { Module } from '@nestjs/common';
import { QainsFormModule } from './qains_form/qains_form.module';
import { QainsOperatorAuditorModule } from './qains_operator_auditor/qains_operator_auditor.module';

@Module({
  imports: [QainsFormModule, QainsOperatorAuditorModule],
})
export class QAInsModule {}
