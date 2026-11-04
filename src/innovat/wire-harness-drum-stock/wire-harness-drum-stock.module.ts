import { Module } from '@nestjs/common';
import { WireHarnessDrumStockController } from './wire-harness-drum-stock.controller';
import { WireHarnessDrumStockService } from './wire-harness-drum-stock.service';
import { WireHarnessDrumStockRepository } from './wire-harness-drum-stock.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WHN_DRUM_STOCK } from 'src/common/Entities/innovat/table/WHN_DRUM_STOCK.entity';
import { WHN_DRUMSTOCK } from 'src/common/Entities/innovat/views/WHN_DRUMSTOCK.entity';
import { WHN_DRUMORDER } from 'src/common/Entities/innovat/views/WHN_DRUMORDER.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        WHN_DRUM_STOCK,
        WHN_DRUMSTOCK,
        WHN_DRUMORDER,
    ], 'mitsuConnection'),
    ],
    controllers: [WireHarnessDrumStockController],
    providers: [WireHarnessDrumStockService, WireHarnessDrumStockRepository],
})
export class WireHarnessDrumStockModule {}
