import { Module } from '@nestjs/common';
import { PurCpcService } from './pur-cpc.service';
import { PurCpcController } from './pur-cpc.controller';
import { PurCpcRepository } from './pur-cpc.repository';
import { CondComparisonPriceModule } from './cond_comparison_price/cond_comparison_price.module';
import { IimModule } from 'src/datacenter/iim/iim.module';
import { IimModule as Iim400Module } from 'src/as400/bpcsfvnew/iim/iim.module';

@Module({
    imports: [CondComparisonPriceModule, IimModule, Iim400Module],
    controllers: [PurCpcController],
    providers: [PurCpcService, PurCpcRepository],
})
export class PurCpcModule {}
