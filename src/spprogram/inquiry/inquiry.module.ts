import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
import { InquiryController } from './inquiry.controller';

@Module({
  controllers: [InquiryController],
  imports: [
    TypeOrmModule.forFeature([Inquiry], 'amecConnection')
  ],
  providers: [InquiryService],
})
export class InquiryModule {}
