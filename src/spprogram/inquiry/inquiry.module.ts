import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
import { InquiryController } from './inquiry.controller';

import { InquiryGroupModule } from '../inquiry-group/inquiry-group.module';
import { InquiryDetailModule } from '../inquiry-detail/inquiry-detail.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inquiry], 'spsysConnection'),
    InquiryGroupModule,
    InquiryDetailModule,
    HistoryModule,
  ],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
