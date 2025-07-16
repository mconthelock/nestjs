import { Module } from '@nestjs/common';
import { InquiryDetailService } from './inquiry-detail.service';
import { InquiryDetailController } from './inquiry-detail.controller';

@Module({
  controllers: [InquiryDetailController],
  providers: [InquiryDetailService],
})
export class InquiryDetailModule {}
