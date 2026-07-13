import { Module } from '@nestjs/common';
import { FinpckVwdetailService } from './finpck-vwdetail.service';
import { FinpckVwdetailController } from './finpck-vwdetail.controller';
import { VWDetailRepository } from './finpck-vwdetail.repository';

@Module({
  controllers: [FinpckVwdetailController],
  providers: [FinpckVwdetailService,VWDetailRepository],
})
export class FinpckVwdetailModule {}
