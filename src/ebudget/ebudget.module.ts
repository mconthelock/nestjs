import { Module } from '@nestjs/common';
import { QuotationModule } from './quotation/ebudget-quotation.module';

@Module({
  imports: [
    QuotationModule
  ],
})
export class EbudgetModule {}
