import { Module } from '@nestjs/common';
// import { InquiryModule } from './inquiry/inquiry.module';
import { InquiryGroupModule } from './inquiry-group/inquiry-group.module';
import { InquiryDetailModule } from './inquiry-detail/inquiry-detail.module';
import { InquiryControlModule } from './inquiry-control/inquiry-control.module';
import { AttachmentModule } from './attachment/attachment.module';
import { TermModule } from './term/term.module';
import { QuotationTypeModule } from './quotation-type/quotation-type.module';
import { ReasonModule } from './reason/reason.module';
import { CurrencyModule } from './currency/currency.module';
import { RatioModule } from './ratio/ratio.module';
import { ShipmentModule } from './shipment/shipment.module';

@Module({
  imports: [
    // InquiryModule,
    InquiryGroupModule,
    InquiryDetailModule,
    InquiryControlModule,
    AttachmentModule,
    TermModule,
    QuotationTypeModule,
    ReasonModule,
    CurrencyModule,
    RatioModule,
    ShipmentModule,
  ],
})
export class SpModule {}
