import { Module } from '@nestjs/common';
import { QuotationTypeService } from './quotation-type.service';
import { QuotationTypeController } from './quotation-type.controller';

@Module({
  controllers: [QuotationTypeController],
  providers: [QuotationTypeService],
})
export class QuotationTypeModule {}
