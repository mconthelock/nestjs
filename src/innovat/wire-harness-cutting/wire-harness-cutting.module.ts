import { Module } from '@nestjs/common';
import { WireHarnessCuttingController } from './wire-harness-cutting.controller';
import { WireHarnessCuttingService } from './wire-harness-cutting.service';
import { WireHarnessCuttingRepository } from './wire-harness-cutting.repository';

@Module({
    controllers: [
        WireHarnessCuttingController,
    ],
    providers: [
        WireHarnessCuttingService,
        WireHarnessCuttingRepository,
    ],
})
export class WireHarnessCuttingModule {}