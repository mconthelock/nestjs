import { Module } from '@nestjs/common';
import { WireHarnessCuttingController } from './wire-harness-cutting.controller';
import { WireHarnessCuttingService } from './wire-harness-cutting.service';
import { WireHarnessCuttingRepository } from './wire-harness-cutting.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WHN_PRODUCTION_PLAN } from 'src/common/Entities/innovat/table/WHN_PRODUCTION_PLAN.entity';
import { WHN_PROCESS } from 'src/common/Entities/innovat/table/WHN_PROCESS.entity';
import { WHN_DRUM_STOCK } from 'src/common/Entities/innovat/table/WHN_DRUM_STOCK.entity';
import { WHN_PRODUCTION } from 'src/common/Entities/innovat/views/WHN_PRODUCTION.entity';
import { WHN_AUTOPLAN } from 'src/common/Entities/innovat/views/WHN_AUTOPLAN.entity';
import { WHN_REASON } from 'src/common/Entities/innovat/table/WHN_REASON.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        WHN_PRODUCTION_PLAN,
        WHN_PROCESS,
        WHN_DRUM_STOCK,
        WHN_PRODUCTION,
        WHN_AUTOPLAN,
        WHN_REASON,
    ], 'mitsuConnection'),
    ],
    controllers: [WireHarnessCuttingController],
    providers: [WireHarnessCuttingService, WireHarnessCuttingRepository],
})
export class WireHarnessCuttingModule {}
