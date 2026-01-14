import { Module } from '@nestjs/common';
import { QuotationService } from './ebudget-quotation.service';
import { QuotationController } from './ebudget-quotation.controller';

import { EbudgetQuotationProductModule } from 'src/ebudget/ebudget-quotation-product/ebudget-quotation-product.module';
import { EbudgetQuotationModule } from 'src/ebudget/ebudget-quotation/ebudget-quotation.module';
import { FormModule } from 'src/webform/form/form.module';
@Module({
  imports: [FormModule, EbudgetQuotationProductModule, EbudgetQuotationModule],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
