import { Module } from '@nestjs/common';
import { QuotationModule } from './quotation/ebudget-quotation.module';
import { IeBgrFormModule } from './form/ie-bgr.module';

@Module({
  imports: [
    IeBgrFormModule,
    QuotationModule
  ],
})
export class IeBgrModule {}
