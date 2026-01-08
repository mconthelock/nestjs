import { Module } from '@nestjs/common';
import { QuotationModule } from './quotation/ebudget-quotation.module';
import { SnModule } from './sn/sn.module';

@Module({
  imports: [
    QuotationModule,
    SnModule
  ],
})
export class EbudgetModule {}
