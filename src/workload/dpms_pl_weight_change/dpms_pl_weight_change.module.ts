import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpmsPlWeightChangeService } from './dpms_pl_weight_change.service';
import { DpmsPlWeightChangeRepository } from './dpms_pl_weight_change.repository';
import { DPMS_PL_WEIGHT_CHANGE } from 'src/common/Entities/workload/views/DPMS_PL_WEIGHT_CHANGE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DPMS_PL_WEIGHT_CHANGE], 'workloadConnection'),
    ],
    controllers: [],
    providers: [DpmsPlWeightChangeService, DpmsPlWeightChangeRepository],
    exports: [DpmsPlWeightChangeService],
})
export class DpmsPlWeightChangeModule {}
