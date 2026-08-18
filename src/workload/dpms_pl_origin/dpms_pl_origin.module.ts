import { Module } from '@nestjs/common';
import { DpmsPlOriginService } from './dpms_pl_origin.service';
import { DpmsPlOriginController } from './dpms_pl_origin.controller';
import { DpmsPlOriginRepository } from './dpms_pl_origin.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_ORIGIN } from 'src/common/Entities/workload/views/DPMS_PL_ORIGIN.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DPMS_PL_ORIGIN], 'workloadConnection')],
    controllers: [DpmsPlOriginController],
    providers: [DpmsPlOriginService, DpmsPlOriginRepository],
    exports: [DpmsPlOriginService],
})
export class DpmsPlOriginModule {}
