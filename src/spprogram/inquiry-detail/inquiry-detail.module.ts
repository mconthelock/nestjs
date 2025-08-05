import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryDetailService } from './inquiry-detail.service';
import { InquiryDetailController } from './inquiry-detail.controller';
import { InquiryDetail } from './entities/inquiry-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InquiryDetail], 'amecConnection')],
  controllers: [InquiryDetailController],
  providers: [InquiryDetailService],
  exports: [InquiryDetailService],
})
export class InquiryDetailModule {}
