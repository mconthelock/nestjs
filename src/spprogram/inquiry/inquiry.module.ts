import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
import { InquiryController } from './inquiry.controller';

import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inquiry], 'amecConnection'),
    HistoryModule,
  ],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
