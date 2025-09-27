import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquiryModule } from './inquiry/inquiry.module';
import { InquiryGroupModule } from './inquiry-group/inquiry-group.module';
import { InquiryDetailModule } from './inquiry-detail/inquiry-detail.module';
import { InquiryControlModule } from './inquiry-control/inquiry-control.module';
import { TermModule } from './term/term.module';
import { QuotationTypeModule } from './quotation-type/quotation-type.module';
import { ReasonModule } from './reason/reason.module';
import { CurrencyModule } from './currency/currency.module';
import { RatioModule } from './ratio/ratio.module';
import { ShipmentModule } from './shipment/shipment.module';
import { MethodModule } from './method/method.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { HistoryModule } from './history/history.module';
import { StatusModule } from './status/status.module';
import { SpUser } from './spusers/spusers.entity';
import { CustomerModule } from './customer/customer.module';
import { InquiryLogModule } from './inquiry-log/inquiry-log.module';
import { TimelineModule } from './timeline/timeline.module';
import { ItemsModule } from './items/items.module';
import { PricelistModule } from './pricelist/pricelist.module';
import { ItemsCustomerModule } from './items-customer/items-customer.module';
import { QuotationModule } from './quotation/quotation.module';
import { WeightModule } from './weight/weight.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpUser], 'amecConnection'),
    InquiryModule,
    InquiryGroupModule,
    InquiryDetailModule,
    InquiryControlModule,
    TermModule,
    QuotationTypeModule,
    ReasonModule,
    CurrencyModule,
    RatioModule,
    ShipmentModule,
    MethodModule,
    AttachmentsModule,
    HistoryModule,
    StatusModule,
    CustomerModule,
    InquiryLogModule,
    TimelineModule,
    ItemsModule,
    PricelistModule,
    ItemsCustomerModule,
    QuotationModule,
    WeightModule,
  ],
})
export class SpModule {}
