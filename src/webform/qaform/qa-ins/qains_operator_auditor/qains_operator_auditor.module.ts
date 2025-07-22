import { Module } from '@nestjs/common';
import { QainsOperatorAuditorService } from './qains_operator_auditor.service';
import { QainsOperatorAuditorController } from './qains_operator_auditor.controller';

@Module({
  controllers: [QainsOperatorAuditorController],
  providers: [QainsOperatorAuditorService],
})
export class QainsOperatorAuditorModule {}
