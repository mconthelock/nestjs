import { Module } from '@nestjs/common';
import { ESCSARMService } from './audit_report_master.service';
import { ESCSARMController } from './audit_report_master.controller';

@Module({
  controllers: [ESCSARMController],
  providers: [ESCSARMService],
})
export class ESCSARMModule {}
