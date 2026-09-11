import { Module } from '@nestjs/common';
import { DpmsPackingListDetailService } from './dpms_packing_list_detail.service';
import { DpmsPackingListDetailController } from './dpms_packing_list_detail.controller';
import { DpmsPackingListDetailRepository } from './dpms_packing_list_detail.repository';

@Module({
    controllers: [DpmsPackingListDetailController],
    providers: [DpmsPackingListDetailService, DpmsPackingListDetailRepository],
})
export class DpmsPackingListDetailModule {}
