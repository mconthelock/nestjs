import { Module } from '@nestjs/common';
import { WireHarnessDrumMasterController } from './wire-harness-drum-master.controller';
import { WireHarnessDrumMasterService } from './wire-harness-drum-master.service';
import { WireHarnessDrumMasterRepository } from './wire-harness-drum-master.repository';

@Module({
    controllers: [
        WireHarnessDrumMasterController,
    ],
    providers: [
        WireHarnessDrumMasterService,
        WireHarnessDrumMasterRepository,
    ],
})
export class WireHarnessDrumMasterModule {}