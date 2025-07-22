import { Module } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { QainsFormController } from './qains_form.controller';

@Module({
  controllers: [QainsFormController],
  providers: [QainsFormService],
})
export class QainsFormModule {}
