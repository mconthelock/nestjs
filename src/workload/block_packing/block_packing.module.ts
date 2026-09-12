import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockPackingService } from './block_packing.service';
import { BlockPackingController } from './block_packing.controller';
import { BlockPackingRepository } from './block_packing.repository';

import { AmecOrders } from 'src/common/Entities/workload/table/amecorders.entity';
import { AmecOrdersSchedule } from 'src/common/Entities/workload/table/amecorders_schedule.entity';
import { AmecOrdersPackNo } from 'src/common/Entities/workload/table/amecorders_packno.entity';
import { PisPages } from 'src/common/Entities/workload/table/pis-pages.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [AmecOrders, AmecOrdersSchedule, AmecOrdersPackNo, PisPages],
            'workloadConnection',
        ),
    ],
    controllers: [BlockPackingController],
    providers: [BlockPackingService, BlockPackingRepository],
})
export class BlockPackingModule {}
