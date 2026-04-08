import { Module } from '@nestjs/common';
import { EbudgetQuotationProductService } from './ebudget-quotation-product.service';
import { EbudgetQuotationProductController } from './ebudget-quotation-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EBUDGET_QUOTATION_PRODUCT } from 'src/common/Entities/ebudget/table/EBUDGET_QUOTATION_PRODUCT.entity';
import { EbudgetQuotationProductRepository } from './ebudget-quotation-product.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [EBUDGET_QUOTATION_PRODUCT],
            'ebudgetConnection',
        ),
    ],
    controllers: [EbudgetQuotationProductController],
    providers: [
        EbudgetQuotationProductService,
        EbudgetQuotationProductRepository,
    ],
    exports: [EbudgetQuotationProductService],
})
export class EbudgetQuotationProductModule {}
