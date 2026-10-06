import { Module } from '@nestjs/common';
import { OriginMasterMarViewService } from './origin_master_mar_view.service';
import { OriginMasterMarViewController } from './origin_master_mar_view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORIGIN_MASTER_MAR_VIEW } from 'src/common/Entities/workload/views/ORIGIN_MASTER_MAR_VIEW.entity';
import { OriginMasterMarViewRepository } from './origin_master_mar_view.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [ORIGIN_MASTER_MAR_VIEW],
            'workloadConnection',
        ),
    ],
    controllers: [OriginMasterMarViewController],
    providers: [OriginMasterMarViewService, OriginMasterMarViewRepository],
})
export class OriginMasterMarViewModule {}
