import { Module } from '@nestjs/common';
import { QainsAuditService } from './qains_audit.service';
import { QainsAuditController } from './qains_audit.controller';

@Module({
  controllers: [QainsAuditController],
  providers: [QainsAuditService],
})
export class QainsAuditModule {}
