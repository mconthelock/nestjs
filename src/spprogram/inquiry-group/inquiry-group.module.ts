import { Module } from '@nestjs/common';
import { InquiryGroupService } from './inquiry-group.service';
import { InquiryGroupController } from './inquiry-group.controller';

@Module({
  controllers: [InquiryGroupController],
  providers: [InquiryGroupService],
})
export class InquiryGroupModule {}
