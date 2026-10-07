import { Module } from '@nestjs/common';
import { DpmsPlMeltLogService } from './dpms_pl_melt_log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_MELT_LOG } from 'src/common/Entities/workload/table/DPMS_PL_MELT_LOG.entity';
import { DpmsPlMeltLogRepository } from './dpms_pl_melt_log.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([DPMS_PL_MELT_LOG], 'workloadConnection'),
    ],
    providers: [DpmsPlMeltLogService, DpmsPlMeltLogRepository],
    exports: [DpmsPlMeltLogService],
})
export class DpmsPlMeltLogModule {}
