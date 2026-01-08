import { Module } from '@nestjs/common';
import { QuotationService } from './ebudget-quotation.service';
import { QuotationController } from './ebudget-quotation.controller';
@Module({
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
