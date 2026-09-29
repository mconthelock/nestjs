import { Module } from '@nestjs/common';
import { PurCpcService } from './services/purcpc_form.service';
import { PurCpcController } from './pur-cpc.controller';
import { PurCpcRepository } from './repository/pucpc_form.repository';
import { IimModule as Iim400Module } from 'src/as400/bpcsfvnew/iim/iim.module';
import { CondComparisonPriceService } from './services/cond_comparison_price.service';
import { CondComparisonPriceRepository } from './repository/cond_comparison_price.repository';
import { PurcpcProcPlanViewRepository } from './repository/purcpc_proc_list_view.repository';
import { PurcpcProcCompareViewRepository } from './repository/purcpc_proc_compare_view.repository';

@Module({
    imports: [Iim400Module],
    controllers: [PurCpcController],
    providers: [
        // service
        PurCpcService,
        CondComparisonPriceService,
        // Repository
        PurCpcRepository,
        CondComparisonPriceRepository,
        PurcpcProcPlanViewRepository,
        PurcpcProcCompareViewRepository,
    ],
})
export class PurCpcModule {}
