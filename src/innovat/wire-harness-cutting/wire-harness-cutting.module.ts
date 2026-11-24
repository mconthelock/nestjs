import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WireHarnessCuttingController } from './wire-harness-cutting.controller';
import { WireHarnessCuttingService } from './wire-harness-cutting.service';
import { WireHarnessCuttingRepository } from './wire-harness-cutting.repository';
import { WHN_GROUP_IP } from 'src/common/Entities/innovat/table/WHN_GROUP_IP.entity';
import { WHN_PRODUCTION_PLAN } from 'src/common/Entities/innovat/table/WHN_PRODUCTION_PLAN.entity';
import { WHN_GROUP } from 'src/common/Entities/innovat/table/WHN_GROUP.entity';
import { WHN_DRUM_STOCK } from 'src/common/Entities/innovat/table/WHN_DRUM_STOCK.entity';
import { WHN_REASON } from 'src/common/Entities/innovat/table/WHN_REASON.entity';
import { WHN_PRODUCTION } from 'src/common/Entities/innovat/views/WHN_PRODUCTION.entity';
import { WHN_AUTOPLAN } from 'src/common/Entities/innovat/views/WHN_AUTOPLAN.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WHN_GROUP_IP,
            WHN_PRODUCTION_PLAN,
            WHN_GROUP,
            WHN_DRUM_STOCK,
            WHN_REASON,
            WHN_PRODUCTION,
            WHN_AUTOPLAN,
        ], 'mitsuConnection'),
    ],
    controllers: [
        WireHarnessCuttingController,
    ],
    providers: [
        WireHarnessCuttingService,
        WireHarnessCuttingRepository,
    ],
})
export class WireHarnessCuttingModule {}