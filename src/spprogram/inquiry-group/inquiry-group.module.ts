import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryGroupService } from './inquiry-group.service';
import { InquiryGroupController } from './inquiry-group.controller';
import { InquiryGroup } from './entities/inquiry-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InquiryGroup], 'amecConnection')],
  controllers: [InquiryGroupController],
  providers: [InquiryGroupService],
  exports: [InquiryGroupService],
})
export class InquiryGroupModule {}
