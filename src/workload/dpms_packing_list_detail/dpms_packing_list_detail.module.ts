import { Module } from '@nestjs/common';
import { DpmsPackingListDetailService } from './dpms_packing_list_detail.service';
import { DpmsPackingListDetailController } from './dpms_packing_list_detail.controller';
import { DpmsPackingListDetailRepository } from './dpms_packing_list_detail.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PACKING_LIST_DETAIL } from 'src/common/Entities/workload/views/DPMS_PACKING_LIST_DETAIL.entity';
import { DPMS_PACKING_LIST_MAIN } from '../../common/Entities/workload/views/DPMS_PACKING_LIST_MAIN.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        DPMS_PACKING_LIST_DETAIL,
        DPMS_PACKING_LIST_MAIN,
    ], 'mitsuConnection'),
    ],
    controllers: [DpmsPackingListDetailController],
    providers: [DpmsPackingListDetailService, DpmsPackingListDetailRepository],
})
export class DpmsPackingListDetailModule {}
