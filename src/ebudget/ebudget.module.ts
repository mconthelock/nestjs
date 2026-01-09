import { Module } from '@nestjs/common';
import { QuotationModule } from './quotation/ebudget-quotation.module';
import { SnModule } from './sn/sn.module';
import { BiddingModule } from './bidding/bidding.module';

@Module({
  imports: [
    QuotationModule,
    SnModule,
    BiddingModule
  ],
})
export class EbudgetModule {}
