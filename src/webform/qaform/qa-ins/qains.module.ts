

import { Module } from '@nestjs/common';
import { QainsFormModule } from './qains_form/qains_form.module';
import { QainsOAModule } from './qains_operator_auditor/qains_operator_auditor.module';

@Module({
  imports: [QainsFormModule, QainsOAModule],
})
export class QAInsModule {}
