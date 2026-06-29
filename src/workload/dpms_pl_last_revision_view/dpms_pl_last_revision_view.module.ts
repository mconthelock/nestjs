import { Module } from '@nestjs/common';
import { DpmsPlLastRevisionViewService } from './dpms_pl_last_revision_view.service';
import { DpmsPlLastRevisionViewController } from './dpms_pl_last_revision_view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_LAST_REVISION_VIEW } from 'src/common/Entities/workload/views/DPMS_PL_LAST_REVISION_VIEW.entity';
import { DpmsPlLastRevisionViewRepository } from './dpms_pl_last_revision_view.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [DPMS_PL_LAST_REVISION_VIEW],
            'workloadConnection',
        ),
    ],
    controllers: [DpmsPlLastRevisionViewController],
    providers: [DpmsPlLastRevisionViewService, DpmsPlLastRevisionViewRepository],
    exports: [DpmsPlLastRevisionViewService],
})
export class DpmsPlLastRevisionViewModule {}
