import { Module } from '@nestjs/common';
import { WireHarnessDrumMasterController } from './wire-harness-drum-master.controller';
import { WireHarnessDrumMasterService } from './wire-harness-drum-master.service';
import { WireHarnessDrumMasterRepository } from './wire-harness-drum-master.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WHN_DRUM_MASTER } from 'src/common/Entities/innovat/table/WHN_DRUM_MASTER.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        WHN_DRUM_MASTER,
    ], 'mitsuConnection'),
    ],
    controllers: [WireHarnessDrumMasterController],
    providers: [WireHarnessDrumMasterService, WireHarnessDrumMasterRepository],
})
export class WireHarnessDrumMasterModule {}
