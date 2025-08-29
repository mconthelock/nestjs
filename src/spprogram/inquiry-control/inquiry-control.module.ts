import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryControlService } from './inquiry-control.service';
import { InquiryControlController } from './inquiry-control.controller';
import { InquiryControl } from './entities/inquiry-control.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InquiryControl], 'spsysConnection')],
  controllers: [InquiryControlController],
  providers: [InquiryControlService],
})
export class InquiryControlModule {}
