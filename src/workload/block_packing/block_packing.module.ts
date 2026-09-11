import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockPackingService } from './block_packing.service';
import { BlockPackingController } from './block_packing.controller';
import { BlockPackingRepository } from './block_packing.repository';

import { AmecOrdersSchedule } from 'src/common/Entities/workload/table/amecorders_schedule.entity';
import { AmecOrders } from 'src/common/Entities/workload/table/amecorders.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AmecOrdersSchedule], 'workloadConnection'),
    ],
    controllers: [BlockPackingController],
    providers: [BlockPackingService, BlockPackingRepository],
})
export class BlockPackingModule {}
