import { Module } from '@nestjs/common';
import { BiddingService } from './bidding.service';
import { BiddingController } from './bidding.controller';
import { EBUDGET_DATA_BIDDING } from 'src/common/Entities/ebudget/views/EBUDGET_DATA_BIDDING.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([EBUDGET_DATA_BIDDING], 'ebudgetConnection'),
  ],
  controllers: [BiddingController],
  providers: [BiddingService],
  exports: [BiddingService],
})
export class BiddingModule {}
