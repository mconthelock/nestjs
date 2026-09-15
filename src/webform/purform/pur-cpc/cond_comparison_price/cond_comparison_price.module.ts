import { Module } from '@nestjs/common';
import { CondComparisonPriceService } from './cond_comparison_price.service';
import { CondComparisonPriceController } from './cond_comparison_price.controller';
import { CondComparisonPriceRepository } from './cond_comparison_price.repository';

@Module({
    controllers: [CondComparisonPriceController],
    providers: [CondComparisonPriceService, CondComparisonPriceRepository],
})
export class CondComparisonPriceModule {}
