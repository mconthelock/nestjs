import { Module } from '@nestjs/common';
import { InquiryControlService } from './inquiry-control.service';
import { InquiryControlController } from './inquiry-control.controller';

@Module({
  controllers: [InquiryControlController],
  providers: [InquiryControlService],
})
export class InquiryControlModule {}
