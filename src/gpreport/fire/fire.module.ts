import { FireCheckHead } from 'src/common/Entities/gpreport/table/FIRE_CHECK_HEAD.entity';
import { FireCheckDetail } from 'src/common/Entities/gpreport/table/FIRE_CHECK_DETAIL.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FireItemMst } from 'src/common/Entities/gpreport/table/FIRE_ITEM_MST.entity';
import { FireController } from './fire.controller';
import { FireService } from './fire.service';
import { FireRepository } from './fire.repository';

import { FireCheckHeadController } from './fire-check-head.controller';
import { FireCheckHeadService } from './fire-check-head.service';
import { FireCheckHeadRepository } from './fire-check-head.repository';
import { FireCheckDetailController } from './fire-check-detail.controller';
import { FireCheckDetailService } from './fire-check-detail.service';
import { FireCheckDetailRepository } from './fire-check-detail.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [FireItemMst, FireCheckHead, FireCheckDetail],
            'gpreportConnection',
        ),
    ],
    controllers: [FireCheckHeadController, FireCheckDetailController, FireController],
    providers: [
        FireService,
        FireRepository,
        FireCheckHeadService,
        FireCheckHeadRepository,
        FireCheckDetailService,
        FireCheckDetailRepository,
    ],
    exports: [FireService, FireRepository, FireCheckHeadService, FireCheckDetailService],
})
export class FireModule {}
