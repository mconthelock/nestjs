import { Module } from '@nestjs/common';
import { WireHarnessJobModule } from './wire-harness-job/wire-harness-job.module';
import { WireHarnessCuttingModule } from './wire-harness-cutting/wire-harness-cutting.module';
import { WireHarnessDrumMasterModule } from './wire-harness-drum-master/wire-harness-drum-master.module';
import { WireHarnessDrumStockModule } from './wire-harness-drum-stock/wire-harness-drum-stock.module';
import { WireHarnessCalculateUsageModule } from './wire-harness-calculate-usage/wire-harness-calculate-usage.module';

@Module({
    imports: [
        WireHarnessJobModule,
        WireHarnessCuttingModule,
        WireHarnessDrumMasterModule,
        WireHarnessDrumStockModule,
        WireHarnessCalculateUsageModule,
    ],
})
export class InnovatModule {}