import { Controller, Get, Param } from '@nestjs/common';
import { DpmsPackingListDetailService } from './dpms_packing_list_detail.service';

@Controller('workload/dpms-packing-list-detail')
export class DpmsPackingListDetailController {
    constructor(private readonly service: DpmsPackingListDetailService) {}

    @Get('order/:order')
    getOrderOrigin(@Param('order') order: string) {
        return this.service.getOrderOrigin(order);
    }
}
