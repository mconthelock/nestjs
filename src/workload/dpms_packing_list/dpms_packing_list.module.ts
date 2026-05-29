import { Module } from '@nestjs/common';
import { DpmsPackingListService } from './dpms_packing_list.service';
import { DpmsPackingListController } from './dpms_packing_list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PACKING_LIST } from 'src/common/Entities/workload/views/DPMS_PACKING_LIST.entity';
import { DpmsPackingListRepository } from './dpms_packing_list.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([DPMS_PACKING_LIST], 'workloadConnection'),
    ],
    controllers: [DpmsPackingListController],
    providers: [DpmsPackingListService, DpmsPackingListRepository],
    exports: [DpmsPackingListService],
})
export class DpmsPackingListModule {}
