import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiriesResolver } from './inquiries.resolver';

@Module({
  providers: [InquiriesResolver, InquiriesService],
})
export class InquiriesModule {}
