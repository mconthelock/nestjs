import { Module } from '@nestjs/common';
import { QuotationModule } from './quotation/ebudget-quotation.module';
import { SnModule } from './sn/sn.module';
import { BiddingModule } from './bidding/bidding.module';
import { EbgreqformModule } from './ebgreqform/ebgreqform.module';
import { EbgreqcolImageModule } from './ebgreqcol-image/ebgreqcol-image.module';
import { EbgreqattfileModule } from './ebgreqattfile/ebgreqattfile.module';
import { EbudgetQuotationModule } from './ebudget-quotation/ebudget-quotation.module';
import { EbudgetQuotationProductModule } from './ebudget-quotation-product/ebudget-quotation-product.module';

@Module({
  imports: [
    QuotationModule,
    SnModule,
    BiddingModule,
    EbgreqformModule,
    EbgreqcolImageModule,
    EbgreqattfileModule,
    EbudgetQuotationModule,
    EbudgetQuotationProductModule
  ],
})
export class EbudgetModule {}
