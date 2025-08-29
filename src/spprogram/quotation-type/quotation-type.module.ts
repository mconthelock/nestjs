import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationTypeService } from './quotation-type.service';
import { QuotationTypeController } from './quotation-type.controller';
import { QuotationType } from './entities/quotation-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuotationType], 'spsysConnection')],
  controllers: [QuotationTypeController],
  providers: [QuotationTypeService],
})
export class QuotationTypeModule {}
