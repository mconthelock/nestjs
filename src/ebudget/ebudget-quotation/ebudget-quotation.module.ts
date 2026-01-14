import { Module } from '@nestjs/common';
import { EbudgetQuotationService } from './ebudget-quotation.service';
import { EbudgetQuotationController } from './ebudget-quotation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EBUDGET_QUOTATION } from 'src/common/Entities/ebudget/table/EBUDGET_QUOTATION.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EBUDGET_QUOTATION], 'ebudgetConnection')],
  controllers: [EbudgetQuotationController],
  providers: [EbudgetQuotationService],
  exports: [EbudgetQuotationService],
})
export class EbudgetQuotationModule {}
