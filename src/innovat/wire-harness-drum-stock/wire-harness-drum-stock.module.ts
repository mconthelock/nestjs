import { Module } from '@nestjs/common';
import { WireHarnessDrumStockController } from './wire-harness-drum-stock.controller';
import { WireHarnessDrumStockService } from './wire-harness-drum-stock.service';
import { WireHarnessDrumStockRepository } from './wire-harness-drum-stock.repository';

@Module({
    controllers: [
        WireHarnessDrumStockController,
    ],
    providers: [
        WireHarnessDrumStockService,
        WireHarnessDrumStockRepository,
    ],
})
export class WireHarnessDrumStockModule {}