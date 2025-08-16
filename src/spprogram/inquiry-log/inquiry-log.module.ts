import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryLogService } from './inquiry-log.service';
import { InquiryLog } from './entities/inquiry-log.entity';
import { InquiryLogController } from './inquiry-log.controller';

@Module({
  controllers: [InquiryLogController],
  imports: [
    TypeOrmModule.forFeature([InquiryLog], 'amecConnection')
  ],
  providers: [InquiryLogService],
})
export class InquiryLogModule {}
