import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationService } from './quotation.service';
import { Quotation } from './entities/quotation.entity';
import { QuotationController } from './quotation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Quotation], 'mitsuConnection')],
  controllers: [QuotationController],
  providers: [QuotationService],
})
export class QuotationModule {}
